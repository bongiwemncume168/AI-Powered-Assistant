import pptxgen from 'pptxgenjs'

// Palette (hex, no leading #) mapped from the app theme
const C = {
  bg: 'FAF6EE',
  card: 'FEFCF7',
  ink: '30291F',
  muted: '7C7364',
  primary: '1F7A7E',
  primaryInk: 'F2FBFB',
  accent: 'E88A4B',
  border: 'E4DBC9',
  secondary: 'EDE6D8',
}

export async function generatePptx() {
  const pptx = new pptxgen()
  pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 })
  pptx.layout = 'WIDE'
  pptx.author = 'Bongiwe Mncume'
  pptx.company = 'HopeSync AI'
  pptx.title = 'HopeSync AI — Less Screen Time. More Service.'

  const W = 13.333
  const H = 7.5

  const kicker = (
    slide: pptxgen.Slide,
    index: string,
    label: string,
  ) => {
    slide.addText(index, {
      x: 0.7,
      y: 0.55,
      w: 1,
      h: 0.4,
      fontFace: 'Consolas',
      fontSize: 12,
      bold: true,
      color: C.accent,
      align: 'left',
    })
    slide.addText(label.toUpperCase(), {
      x: 10.2,
      y: 0.55,
      w: 2.4,
      h: 0.4,
      fontFace: 'Arial',
      fontSize: 10,
      bold: true,
      color: C.muted,
      charSpacing: 2,
      align: 'right',
    })
  }

  // ---------- Slide 1: Title ----------
  const s1 = pptx.addSlide()
  s1.background = { color: C.primary }
  s1.addText('HopeSync AI', {
    x: 0.7,
    y: 0.55,
    w: 6,
    h: 0.5,
    fontFace: 'Arial',
    fontSize: 16,
    bold: true,
    color: C.primaryInk,
  })
  s1.addText('AI Workplace Assistant for Non-Profits', {
    x: 0.7,
    y: 2.5,
    w: 11,
    h: 0.5,
    fontFace: 'Arial',
    fontSize: 14,
    color: C.accent,
    bold: true,
  })
  s1.addText('HopeSync AI', {
    x: 0.65,
    y: 2.9,
    w: 12,
    h: 1.6,
    fontFace: 'Georgia',
    fontSize: 72,
    bold: true,
    color: C.primaryInk,
  })
  s1.addText('Less Screen Time. More Service.', {
    x: 0.7,
    y: 4.35,
    w: 12,
    h: 0.8,
    fontFace: 'Georgia',
    italic: true,
    fontSize: 30,
    color: C.accent,
  })
  s1.addText(
    'Helping soup kitchens, shelters, and community organisations reduce administration so they can spend more time helping people.',
    {
      x: 0.7,
      y: 5.2,
      w: 9,
      h: 1,
      fontFace: 'Arial',
      fontSize: 14,
      color: 'D8ECEC',
      lineSpacingMultiple: 1.3,
    },
  )
  s1.addText(
    [
      { text: 'PRESENTED BY\n', options: { fontSize: 9, color: '9FCACB', charSpacing: 2 } },
      { text: 'Bongiwe Mncume', options: { fontSize: 15, bold: true, color: C.primaryInk } },
    ],
    { x: 0.7, y: 6.5, w: 6, h: 0.7, fontFace: 'Arial' },
  )

  // ---------- Slide 2: Problem ----------
  const s2 = pptx.addSlide()
  s2.background = { color: C.bg }
  kicker(s2, '01', 'The Problem')
  s2.addText('Challenges faced by non-profits', {
    x: 0.7,
    y: 1.1,
    w: 11.9,
    h: 0.9,
    fontFace: 'Georgia',
    fontSize: 40,
    bold: true,
    color: C.ink,
  })
  s2.addText(
    'Many community organisations struggle with everyday admin that pulls them away from their mission.',
    {
      x: 0.7,
      y: 1.95,
      w: 11,
      h: 0.5,
      fontFace: 'Arial',
      fontSize: 14,
      color: C.muted,
    },
  )
  const challenges = [
    'Time-consuming paperwork',
    'Manual volunteer scheduling',
    'Writing emails and reports',
    'Recording meeting notes',
    'Managing donation campaigns',
    'Limited staff & volunteer resources',
  ]
  challenges.forEach((label, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = 0.7 + col * 4.05
    const y = 2.7 + row * 1.15
    s2.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.8,
      h: 0.95,
      fill: { color: C.card },
      line: { color: C.border, width: 1 },
      rectRadius: 0.12,
    })
    s2.addText(label, {
      x: x + 0.25,
      y,
      w: 3.4,
      h: 0.95,
      fontFace: 'Arial',
      fontSize: 13,
      bold: true,
      color: C.ink,
      valign: 'middle',
    })
  })
  s2.addShape(pptx.ShapeType.roundRect, {
    x: 0.7,
    y: 5.35,
    w: 11.95,
    h: 1.1,
    fill: { color: 'FBEBDD' },
    line: { type: 'none' },
    rectRadius: 0.12,
  })
  s2.addText(
    [
      { text: 'Impact:  ', options: { bold: true, color: C.ink } },
      {
        text: 'More time spent on administration means less time serving people in need.',
        options: { color: C.ink },
      },
    ],
    {
      x: 1.05,
      y: 5.35,
      w: 11.3,
      h: 1.1,
      fontFace: 'Arial',
      fontSize: 14,
      valign: 'middle',
    },
  )

  // ---------- Slide 3: Solution ----------
  const s3 = pptx.addSlide()
  s3.background = { color: C.bg }
  kicker(s3, '02', 'Our Solution')
  s3.addText('Introducing HopeSync AI', {
    x: 0.7,
    y: 1.1,
    w: 5.6,
    h: 1.4,
    fontFace: 'Georgia',
    fontSize: 38,
    bold: true,
    color: C.ink,
  })
  s3.addText(
    'A workplace assistant designed specifically for non-profits, handling the busywork so your team can focus on people.',
    {
      x: 0.7,
      y: 2.7,
      w: 5.5,
      h: 1.2,
      fontFace: 'Arial',
      fontSize: 14,
      color: C.muted,
      lineSpacingMultiple: 1.3,
    },
  )
  s3.addShape(pptx.ShapeType.roundRect, {
    x: 0.7,
    y: 5.3,
    w: 5.5,
    h: 1.4,
    fill: { color: C.primary },
    line: { type: 'none' },
    rectRadius: 0.12,
  })
  s3.addText(
    [
      { text: 'Mission:  ', options: { bold: true, color: 'FFFFFF' } },
      {
        text: 'Reduce administrative work so organisations can focus on making a greater social impact.',
        options: { color: 'E6F4F4' },
      },
    ],
    {
      x: 1,
      y: 5.3,
      w: 5,
      h: 1.4,
      fontFace: 'Arial',
      fontSize: 13,
      valign: 'middle',
      lineSpacingMultiple: 1.2,
    },
  )
  s3.addText('KEY FEATURES', {
    x: 6.7,
    y: 1.1,
    w: 6,
    h: 0.4,
    fontFace: 'Arial',
    fontSize: 11,
    bold: true,
    color: C.muted,
    charSpacing: 2,
  })
  const features = [
    'Volunteer Scheduler',
    'Smart Email Generator',
    'Task Planner',
    'Shift Handover Summaries',
    'Meeting Notes Summariser',
    'Donation Campaign Assistant',
    'AI Research Assistant',
  ]
  features.forEach((label, i) => {
    const y = 1.6 + i * 0.74
    s3.addShape(pptx.ShapeType.roundRect, {
      x: 6.7,
      y,
      w: 5.95,
      h: 0.62,
      fill: { color: C.card },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
    })
    s3.addShape(pptx.ShapeType.roundRect, {
      x: 6.9,
      y: y + 0.13,
      w: 0.36,
      h: 0.36,
      fill: { color: 'FBEBDD' },
      line: { type: 'none' },
      rectRadius: 0.06,
    })
    s3.addText(label, {
      x: 7.45,
      y,
      w: 5,
      h: 0.62,
      fontFace: 'Arial',
      fontSize: 13,
      bold: true,
      color: C.ink,
      valign: 'middle',
    })
  })

  // ---------- Slide 4: Benefits ----------
  const s4 = pptx.addSlide()
  s4.background = { color: C.bg }
  kicker(s4, '03', 'Benefits')
  s4.addText('How HopeSync AI helps', {
    x: 0.7,
    y: 1.1,
    w: 11.9,
    h: 0.9,
    fontFace: 'Georgia',
    fontSize: 40,
    bold: true,
    color: C.ink,
  })
  const groups = [
    {
      title: 'For Staff',
      points: [
        'Saves hours of administrative work',
        'Keeps teams organised',
        'Improves communication',
      ],
    },
    {
      title: 'For Volunteers',
      points: ['Clear schedules', 'Easy task assignments', 'Better coordination'],
    },
    {
      title: 'For Communities',
      points: [
        'Faster service delivery',
        'More efficient operations',
        'Greater focus on helping vulnerable people',
      ],
    },
  ]
  groups.forEach((g, i) => {
    const x = 0.7 + i * 4.05
    const y = 2.25
    const dark = i === 2
    s4.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.8,
      h: 4.3,
      fill: { color: dark ? C.primary : C.card },
      line: dark ? { type: 'none' } : { color: C.border, width: 1 },
      rectRadius: 0.14,
    })
    s4.addText(g.title, {
      x: x + 0.35,
      y: y + 0.35,
      w: 3.1,
      h: 0.6,
      fontFace: 'Georgia',
      fontSize: 22,
      bold: true,
      color: dark ? 'FFFFFF' : C.ink,
    })
    s4.addText(
      g.points.map((p) => ({
        text: p,
        options: {
          bullet: { code: '2022', indent: 15 },
          color: dark ? 'DCEFEF' : C.muted,
        },
      })),
      {
        x: x + 0.35,
        y: y + 1.15,
        w: 3.15,
        h: 2.9,
        fontFace: 'Arial',
        fontSize: 13,
        lineSpacingMultiple: 1.4,
        valign: 'top',
      },
    )
  })

  // ---------- Slide 5: Vision ----------
  const s5 = pptx.addSlide()
  s5.background = { color: C.bg }
  kicker(s5, '04', 'Vision & Future')
  s5.addText('Building stronger communities through AI', {
    x: 0.7,
    y: 1.1,
    w: 5.7,
    h: 1.6,
    fontFace: 'Georgia',
    fontSize: 34,
    bold: true,
    color: C.ink,
  })
  s5.addShape(pptx.ShapeType.roundRect, {
    x: 0.7,
    y: 2.95,
    w: 5.6,
    h: 2.2,
    fill: { color: 'FBEBDD' },
    line: { type: 'none' },
    rectRadius: 0.14,
  })
  s5.addText('OUR VISION', {
    x: 1.05,
    y: 3.2,
    w: 5,
    h: 0.4,
    fontFace: 'Arial',
    fontSize: 11,
    bold: true,
    color: C.accent,
    charSpacing: 2,
  })
  s5.addText(
    'To empower every non-profit organisation with simple, accessible AI tools that improve efficiency and maximise community impact.',
    {
      x: 1.05,
      y: 3.6,
      w: 4.9,
      h: 1.4,
      fontFace: 'Arial',
      fontSize: 14,
      color: C.ink,
      lineSpacingMultiple: 1.3,
    },
  )
  s5.addText('Empowering people who empower communities.', {
    x: 0.7,
    y: 5.6,
    w: 5.6,
    h: 0.8,
    fontFace: 'Georgia',
    italic: true,
    fontSize: 18,
    color: C.primary,
  })
  s5.addText('FUTURE ENHANCEMENTS', {
    x: 6.8,
    y: 1.1,
    w: 6,
    h: 0.4,
    fontFace: 'Arial',
    fontSize: 11,
    bold: true,
    color: C.muted,
    charSpacing: 2,
  })
  const future = [
    'Mobile App',
    'Multilingual Support',
    'Donor Management Dashboard',
    'AI Chat Assistant',
    'Analytics & Reporting',
    'Calendar & Email Integration',
  ]
  future.forEach((label, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 6.8 + col * 3.0
    const y = 1.65 + row * 1.6
    s5.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 2.8,
      h: 1.4,
      fill: { color: C.card },
      line: { color: C.border, width: 1 },
      rectRadius: 0.12,
    })
    s5.addText(label, {
      x: x + 0.2,
      y,
      w: 2.45,
      h: 1.4,
      fontFace: 'Arial',
      fontSize: 13,
      bold: true,
      color: C.ink,
      valign: 'middle',
    })
  })

  await pptx.writeFile({ fileName: 'HopeSync-AI-Presentation.pptx' })
}
