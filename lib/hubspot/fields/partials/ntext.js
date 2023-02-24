import { group, styleGroup } from '../group.js'
import { fields as f } from '../fields.js'
import { styleFields as s } from '../style-fields.js'

const nText = f.text('text label', 'text',
  {
    inline_help_text: 'adfsd',
    validation_regex: '^[a-zA-Z0-9]*$',
    visibility_rules: 'SIMPLE',
    visibility: { controlling_field: 'text', operator: 'NOT_EMPTY' },
    occurrence: {}
  }
)

const nTextGroup = group('Text', 'text', {},
  f.text('Text label', 'text')
)

const nTextStyle = styleGroup({},
  group('Alignment', 'alignment', {},
    s.alignment('Alignment', 'alignment',
      {
        alignment_direction: 'BOTH',
        default: {
          horizontal_align: 'CENTER'
        }
      }
    )
  )
)

export { nText, nTextGroup, nTextStyle }
