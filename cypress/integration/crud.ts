describe('Entry CRUD', () => {
  before(() => {
    cy.clearDB()
  })

  it('shows an empty state', () => {
    cy.visit('/')
    cy.contains('No entries yet')
  })

  it ('opens the add dialog', () => {
    cy.visit('/')
    cy.get('[title="Add a new entry"]').click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/add')
    })
  })

  const startHours = 15, startMinutes = 27, endHours = 16, endMinutes = 38

  it('sets the start time', () => {
    pickTime('Start', startHours, startMinutes)
  })

  it('sets the end time', () => {
    pickTime('End', endHours, endMinutes)
  })

  it('sets the other properties', () => {
    // not really black box, but I can't find anything better :-/
    cy.get('[type="radio"][name="side"]').check('RIGHT')
    cy.get('[type="radio"][name="position"]').check('CLUTCH')
  })

  it('saves the entry', () => {
    cy.contains('Save').click()
  })

  it('displays the saved entry', () => {
    checkEntry(startHours, startMinutes, endHours, endMinutes, 'right', 'clutch')
  })

  it('displays the time since last feed', () => {
    // Alternatively we could mock the clock, but I didn't manage to make that
    // work
    const now = new Date()
    const feedEnd = new Date(now)
    feedEnd.setHours(endHours)
    feedEnd.setMinutes(endMinutes)
    feedEnd.setSeconds(0)

    if (feedEnd.getTime() > now.getTime()) {
      feedEnd.setTime(feedEnd.getTime() - 24 * 3600 * 1000)
    }

    cy.contains(`${formatDateDifference(feedEnd, now)} since last feed`)
  })

  it('edits an entry', () => {
    cy.get('a.log-entry').click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/edit/1')
    })

    cy.get('[type="radio"][name="position"]').check('CRADLE')
    cy.contains('Save').click()
    checkEntry(startHours, startMinutes, endHours, endMinutes, 'right', 'cradle')
  })

  it('deletes the entry', () => {
    cy.get('a.log-entry').click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/edit/1')
    })

    cy.contains('Delete').click()
    cy.contains('Really delete?').click()

    cy.contains('No entries yet')
  })
})

function checkEntry(
  startHours: number,
  startMinutes: number,
  endHours: number,
  endMinutes: number,
  side: 'left' | 'right',
  position: string,
): void {
  cy.get('a.log-entry').within(() => {
    cy.contains(`${startHours}:${startMinutes}`)
    cy.contains(`${endHours}:${endMinutes}`)
    cy.contains(formatDuration(endHours - startHours, endMinutes - startMinutes))
    cy.contains(position)
    cy.get(`[aria-label="arrow-${side}"]`)
  })
}

function pickTime(buttonName: string, hours: number, minutes: number) {
  cy.get(`button[name="${buttonName}"]`).then((button) => {
    cy.wrap(button).click()

    // force both clicks below, because it does not really matter which element
    // gets clicked (the value is computed from the pointer position)
    cy.get('button').contains('' + hours).click({force: true})
    cy.get('button').contains('' + minutes).click({force: true})
    cy.wrap(button).contains(`${hours} : ${minutes}`)
  })
}

function formatDateDifference(d: Date, now: Date): string {
  // I could also import src/format.ts, but this keeps tests more independent
  const elapsedSeconds = (now.getTime() - (d.getTime())) / 1000
  const elapsedHours = Math.floor(elapsedSeconds / 3600)
  const elapsedMinutes = Math.floor((elapsedSeconds - 3600 * elapsedHours) / 60)

  return formatDuration(elapsedHours, elapsedMinutes)
}

function formatDuration(hours: number, minutes: number): string {
  const plural = (s: string, n: number) => `${s}${n > 1 ? 's' : ''}`
  const elapsed = (n: number, unit: string) => `${n} ${plural(unit, n)}`
  let durationMinutes = elapsed(minutes, 'minute')

  return hours === 0 ? durationMinutes : `${elapsed(hours, 'hour')} ${durationMinutes}`
}