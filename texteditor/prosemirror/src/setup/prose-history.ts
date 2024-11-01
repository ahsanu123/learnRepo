/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command, EditorState, Plugin, PluginKey, SelectionBookmark, Transaction } from "prosemirror-state"
import { Mapping, Step, StepMap, Transform } from "prosemirror-transform"
import RopeSequence from "rope-sequence"

const max_empty_items = 500

class Branch {
  constructor(readonly items: RopeSequence<Item>, readonly eventCount: number) { }

  popEvent(state: EditorState, preserveItems: boolean) {
    if (this.eventCount == 0) return null

    let end = this.items.length
    for (; ; end--) {
      const next = this.items.get(end - 1)
      if (next.selection) { --end; break }
    }

    let remap: Mapping | undefined, mapFrom: number | undefined
    if (preserveItems) {
      remap = this.remapping(end, this.items.length)
      mapFrom = remap.maps.length
    }
    const transform = state.tr
    let selection: SelectionBookmark | undefined, remaining: Branch | undefined
    const addAfter: Item[] = [], addBefore: Item[] = []

    this.items.forEach((item, i) => {
      if (!item.step) {
        if (!remap) {
          remap = this.remapping(end, i + 1)
          mapFrom = remap.maps.length
        }
        mapFrom!--
        addBefore.push(item)
        return
      }

      if (remap) {
        addBefore.push(new Item(item.map))
        const step = item.step.map(remap.slice(mapFrom))
        let map

        if (step && transform.maybeStep(step).doc) {
          map = transform.mapping.maps[transform.mapping.maps.length - 1]
          addAfter.push(new Item(map, undefined, undefined, addAfter.length + addBefore.length))
        }
        mapFrom!--
        if (map) remap.appendMap(map, mapFrom)
      } else {
        transform.maybeStep(item.step)
      }

      if (item.selection) {
        selection = remap ? item.selection.map(remap.slice(mapFrom)) : item.selection
        remaining = new Branch(this.items.slice(0, end).append(addBefore.reverse().concat(addAfter)), this.eventCount - 1)
        return false
      }
    }, this.items.length, 0)

    return { remaining: remaining!, transform, selection: selection! }
  }

  addTransform(transform: Transform, selection: SelectionBookmark | undefined,
    histOptions: Required<HistoryOptions>, preserveItems: boolean) {
    const newItems = []
    let eventCount = this.eventCount
    let oldItems = this.items, lastItem = !preserveItems && oldItems.length ? oldItems.get(oldItems.length - 1) : null

    for (let i = 0; i < transform.steps.length; i++) {
      const step = transform.steps[i].invert(transform.docs[i])
      let item = new Item(transform.mapping.maps[i], step, selection)
      const merged = lastItem;
      if (merged && lastItem?.merge(item)) {
        item = merged
        if (i) newItems.pop()
        else oldItems = oldItems.slice(0, oldItems.length - 1)
      }
      newItems.push(item)
      if (selection) {
        eventCount++
        selection = undefined
      }
      if (!preserveItems) lastItem = item
    }
    const overflow = eventCount - histOptions.depth
    if (overflow > DEPTH_OVERFLOW) {
      oldItems = cutOffEvents(oldItems, overflow)
      eventCount -= overflow
    }
    return new Branch(oldItems.append(newItems), eventCount)
  }

  remapping(from: number, to: number): Mapping {
    const maps = new Mapping
    this.items.forEach((item, i) => {
      const mirrorPos = item.mirrorOffset != null && i - item.mirrorOffset >= from
        ? maps.maps.length - item.mirrorOffset : undefined
      maps.appendMap(item.map, mirrorPos)
    }, from, to)
    return maps
  }

  addMaps(array: readonly StepMap[]) {
    if (this.eventCount == 0) return this
    return new Branch(this.items.append(array.map(map => new Item(map))), this.eventCount)
  }

  rebased(rebasedTransform: Transform, rebasedCount: number) {
    if (!this.eventCount) return this

    const rebasedItems: Item[] = [], start = Math.max(0, this.items.length - rebasedCount)

    const mapping = rebasedTransform.mapping
    let newUntil = rebasedTransform.steps.length
    let eventCount = this.eventCount
    this.items.forEach(item => { if (item.selection) eventCount-- }, start)

    let iRebased = rebasedCount
    this.items.forEach(item => {
      const pos = mapping.getMirror(--iRebased)
      if (pos == null) return
      newUntil = Math.min(newUntil, pos)
      const map = mapping.maps[pos]
      if (item.step) {
        const step = rebasedTransform.steps[pos].invert(rebasedTransform.docs[pos])
        const selection = item.selection && item.selection.map(mapping.slice(iRebased + 1, pos))
        if (selection) eventCount++
        rebasedItems.push(new Item(map, step, selection))
      } else {
        rebasedItems.push(new Item(map))
      }
    }, start)

    const newMaps = []
    for (let i = rebasedCount; i < newUntil; i++)
      newMaps.push(new Item(mapping.maps[i]))
    const items = this.items.slice(0, start).append(newMaps).append(rebasedItems)
    let branch = new Branch(items, eventCount)

    if (branch.emptyItemCount() > max_empty_items)
      branch = branch.compress(this.items.length - rebasedItems.length)
    return branch
  }

  emptyItemCount() {
    let count = 0
    this.items.forEach(item => { if (!item.step) count++ })
    return count
  }

  compress(upto = this.items.length) {
    const remap = this.remapping(0, upto)
    const items: Item[] = []

    let events = 0, mapFrom = remap.maps.length
    this.items.forEach((item, i) => {
      if (i >= upto) {
        items.push(item)
        if (item.selection) events++
      } else if (item.step) {
        const step = item.step.map(remap.slice(mapFrom)), map = step && step.getMap()
        mapFrom--
        if (map) remap.appendMap(map, mapFrom)
        if (step) {
          const selection = item.selection && item.selection.map(remap.slice(mapFrom))
          if (selection) events++
          const newItem = new Item(map!.invert(), step, selection), last = items.length - 1
          const merged = items[length];

          if (merged && items[last].merge(newItem))
            items[last] = merged
          else
            items.push(newItem)
        }
      } else if (item.map) {
        mapFrom--
      }
    }, this.items.length, 0)
    return new Branch(RopeSequence.from(items.reverse()), events)
  }

  static empty = new Branch(RopeSequence.empty, 0)
}

function cutOffEvents(items: RopeSequence<Item>, n: number) {
  let cutPoint: number | undefined
  items.forEach((item, i) => {
    if (item.selection && (n-- == 0)) {
      cutPoint = i
      return false
    }
  })
  return items.slice(cutPoint!)
}

class Item {
  constructor(
    readonly map: StepMap,
    readonly step?: Step,
    readonly selection?: SelectionBookmark,
    readonly mirrorOffset?: number
  ) { }

  merge(other: Item) {
    if (this.step && other.step && !other.selection) {
      const step = other.step.merge(this.step)
      if (step) return new Item(step.getMap().invert(), step, this.selection)
    }
  }
}

class HistoryState {
  constructor(
    readonly done: Branch,
    readonly undone: Branch,
    readonly prevRanges: readonly number[] | null,
    readonly prevTime: number,
    readonly prevComposition: number
  ) { }
}

const DEPTH_OVERFLOW = 20

function applyTransaction(history: HistoryState, state: EditorState, tr: Transaction, options: Required<HistoryOptions>) {
  const historyTr = tr.getMeta(historyKey)
  const rebased: number = tr.getMeta("rebased")
  if (historyTr) return historyTr.historyState

  if (tr.getMeta(closeHistoryKey)) history = new HistoryState(history.done, history.undone, null, 0, -1)

  const appended = tr.getMeta("appendedTransaction")

  if (tr.steps.length == 0) {
    return history
  } else if (appended && appended.getMeta(historyKey)) {
    if (appended.getMeta(historyKey).redo)
      return new HistoryState(history.done.addTransform(tr, undefined, options, mustPreserveItems(state)),
        history.undone, rangesFor(tr.mapping.maps),
        history.prevTime, history.prevComposition)
    else
      return new HistoryState(history.done, history.undone.addTransform(tr, undefined, options, mustPreserveItems(state)),
        null, history.prevTime, history.prevComposition)
  } else if (tr.getMeta("addToHistory") !== false && !(appended && appended.getMeta("addToHistory") === false)) {

    const composition = tr.getMeta("composition")
    const newGroup = history.prevTime == 0 ||
      (!appended && history.prevComposition != composition &&
        (history.prevTime < (tr.time || 0) - options.newGroupDelay || !isAdjacentTo(tr, history.prevRanges!)))
    const prevRanges = appended ? mapRanges(history.prevRanges!, tr.mapping) : rangesFor(tr.mapping.maps)
    return new HistoryState(history.done.addTransform(tr, newGroup ? state.selection.getBookmark() : undefined,
      options, mustPreserveItems(state)),
      Branch.empty, prevRanges, tr.time, composition == null ? history.prevComposition : composition)
  } else if (rebased) {

    return new HistoryState(history.done.rebased(tr, rebased),
      history.undone.rebased(tr, rebased),
      mapRanges(history.prevRanges!, tr.mapping), history.prevTime, history.prevComposition)
  } else {
    return new HistoryState(history.done.addMaps(tr.mapping.maps),
      history.undone.addMaps(tr.mapping.maps),
      mapRanges(history.prevRanges!, tr.mapping), history.prevTime, history.prevComposition)
  }
}

function isAdjacentTo(transform: Transform, prevRanges: readonly number[]) {
  if (!prevRanges) return false
  if (!transform.docChanged) return true
  let adjacent = false
  transform.mapping.maps[0].forEach((start, end) => {
    for (let i = 0; i < prevRanges.length; i += 2)
      if (start <= prevRanges[i + 1] && end >= prevRanges[i])
        adjacent = true
  })
  return adjacent
}

function rangesFor(maps: readonly StepMap[]) {
  const result: number[] = []
  for (let i = maps.length - 1; i >= 0 && result.length == 0; i--)
    maps[i].forEach((_from, _to, from, to) => result.push(from, to))
  return result
}

function mapRanges(ranges: readonly number[], mapping: Mapping) {
  if (!ranges) return null
  const result = []
  for (let i = 0; i < ranges.length; i += 2) {
    const from = mapping.map(ranges[i], 1), to = mapping.map(ranges[i + 1], -1)
    if (from <= to) result.push(from, to)
  }
  return result
}

function histTransaction(history: HistoryState, state: EditorState, redo: boolean): Transaction | null {
  const preserveItems = mustPreserveItems(state)
  const histOptions = (historyKey.get(state)!.spec as any).config as Required<HistoryOptions>
  const pop = (redo ? history.undone : history.done).popEvent(state, preserveItems)
  if (!pop) return null

  const selection = pop.selection!.resolve(pop.transform.doc)
  const added = (redo ? history.done : history.undone).addTransform(pop.transform, state.selection.getBookmark(),
    histOptions, preserveItems)

  const newHist = new HistoryState(redo ? added : pop.remaining, redo ? pop.remaining : added, null, 0, -1)
  return pop.transform.setSelection(selection).setMeta(historyKey, { redo, historyState: newHist })
}

let cachedPreserveItems = false, cachedPreserveItemsPlugins: readonly Plugin[] | null = null

function mustPreserveItems(state: EditorState) {
  const plugins = state.plugins
  if (cachedPreserveItemsPlugins != plugins) {
    cachedPreserveItems = false
    cachedPreserveItemsPlugins = plugins
    for (let i = 0; i < plugins.length; i++) if ((plugins[i].spec as any).historyPreserveItems) {
      cachedPreserveItems = true
      break
    }
  }
  return cachedPreserveItems
}

export function closeHistory(tr: Transaction) {
  return tr.setMeta(closeHistoryKey, true)
}

const historyKey = new PluginKey("history")
const closeHistoryKey = new PluginKey("closeHistory")

interface HistoryOptions {
  depth?: number
  newGroupDelay?: number
}

export function history(config: HistoryOptions = {}): Plugin {
  config = {
    depth: config.depth || 100,
    newGroupDelay: config.newGroupDelay || 500
  }

  return new Plugin({
    key: historyKey,

    state: {
      init() {
        return new HistoryState(Branch.empty, Branch.empty, null, 0, -1)
      },
      apply(tr, hist, state) {
        return applyTransaction(hist, state, tr, config as Required<HistoryOptions>)
      }
    },

    config,

    props: {
      handleDOMEvents: {
        beforeinput(view, e: Event) {
          const inputType = (e as InputEvent).inputType
          const command = inputType == "historyUndo" ? undo : inputType == "historyRedo" ? redo : null
          if (!command || !view.editable) return false
          e.preventDefault()
          return command(view.state, view.dispatch)
        }
      }
    }
  })
}

function buildCommand(redo: boolean, scroll: boolean): Command {
  return (state, dispatch) => {
    const hist = historyKey.getState(state)
    if (!hist || (redo ? hist.undone : hist.done).eventCount == 0) return false
    if (dispatch) {
      const tr = histTransaction(hist, state, redo)
      if (tr) dispatch(scroll ? tr.scrollIntoView() : tr)
    }
    return true
  }
}

export const undo = buildCommand(false, true)

export const redo = buildCommand(true, true)

export const undoNoScroll = buildCommand(false, false)

export const redoNoScroll = buildCommand(true, false)

export function undoDepth(state: EditorState) {
  const hist = historyKey.getState(state)
  return hist ? hist.done.eventCount : 0
}

export function redoDepth(state: EditorState) {
  const hist = historyKey.getState(state)
  return hist ? hist.undone.eventCount : 0
}
