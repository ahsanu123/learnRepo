import { Props } from '../shared';
import { observer } from "mobx-react-lite";
import { Button, Divider, makeStyles, SelectTabEventHandler, Tab, TabList, typographyStyles } from '@fluentui/react-components';
import Plot from 'react-plotly.js';
import { Data, Layout } from 'plotly.js';
import { useState } from 'react';


const obj: IObjek = {
  x: new Array<number>(),
  y: new Array<number>()
}

for (let i = 0; i < 500; i++) {
  obj.x.push(Math.random())
  obj.y.push(Math.random() + 1)
}

const data: Data = {
  ...obj,
  type: 'histogram2dcontour'
};

const plotLayout: Partial<Layout> = {
  title: 'Hell Yeah',
  autosize: true,
  width: 500,
  height: 500,
  margin: {
    l: 65,
    r: 50,
    b: 65,
    t: 90,
  }
}

interface IObjek { x: Array<number>, y: Array<number> }

const useStyle = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: "5px",
  },
  topTitle: {
    "&h1": typographyStyles.title1,
    "&sub": typographyStyles.subtitle2
  },
  mainDataView: {
    display: 'flex',
    flexDirection: 'row',
    margin: '20px 0'
  }
})

type TabName = 'HISTOGRAM' | 'DATA'

const WelcomePageObs: React.FC<Props> = () => {

  const style = useStyle()
  const [selectedTab, setSelectedTab] = useState<TabName>('HISTOGRAM')
  const onTabSelect: SelectTabEventHandler = (event, data) => {
    setSelectedTab(data.value as TabName)
  }
  return (<>
    <div
      className={style.root}
    >
      <div
        className={style.topTitle}
      >
        <h1
        >
          🌕 SORE
        </h1>
        <p>
          Solder Reflow Hot Plate
        </p>
      </div>

      <Divider />

      <div
        className={style.mainDataView}
      >
        <div>
          <TabList
            onTabSelect={onTabSelect}
            selectedValue='HISTOGRAM'
          >
            <Tab
              value='HISTOGRAM'
            >
              Histogram
            </Tab>
          </TabList>
          {selectedTab === 'HISTOGRAM' && (
            <Plot
              data={[
                data
              ]}
              layout={plotLayout}
            />
          )}
          <Divider />
          <Button>Hell yeah</Button>
        </div>

        <div
          style={{
            backgroundColor: 'red',
            width: '100%',
            flex: '2 1 0'
          }}
        >
        </div>
      </div>

    </div>
  </>
  )
}

export const WelcomPage = observer(WelcomePageObs);
