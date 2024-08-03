import { BlockSchema, defineBlockSchema } from "@blocksuite/store";
import { z } from 'zod'

export const customSchemas1 = defineBlockSchema({
  flavour: "custom:",
  metadata: {
    version: 0,
    role: 'content'
  }
})

export const collectionCustomSchemas: z.infer<typeof BlockSchema>[] = [
  customSchemas1
]
