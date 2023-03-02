import { group, styleGroup } from '../group.js'
import { fields as f } from '../content-tab-fields.js'
import { styleFields as s } from '../style-fields.js'

const nText = f.text('text', 'Text', { allow_new_line: true })

const nTextGroup = group('text', 'Text', {},
  f.text('text', 'Text', { allow_new_line: true })
)

const nTextStyle = styleGroup({},
  group('presets', 'Presets', {},
    s.choice('custom_preset', 'Custom preset',
      {
        help_text: 'Custom presets to globally restyle module',
        choices: [
          ['preset1', 'Preset 1'],
          ['preset2', 'Preset 2'],
          ['preset3', 'Preset 3']
        ]
      }
    )
  ),
  group('alignment', 'Alignment', {},
    s.alignment('alignment', 'Alignment',
      {
        alignment_direction: 'HORIZONTAL'
      }
    )
  ),
  group('spacing', 'Spacing', {},
    s.spacing('spacing', 'Spacing')
  ),
  group('background', 'Background', {},
    s.color('color', 'Color')
  ),
  group('custom_theme_overrides', 'Custom theme overrides',
    {
      help_text: 'Override global theme settings for the current component'
    },
    s.spacing('spacing', 'Spacing'),
    s.color('background', 'Background'),
    s.font('font', 'Font')
  )
)

export { nText, nTextGroup, nTextStyle }
