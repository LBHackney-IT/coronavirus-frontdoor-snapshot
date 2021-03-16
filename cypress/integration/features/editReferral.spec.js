context('Edit referral', () => {
  beforeEach(() => {
    cy.task('createReferral', {
      firstName: 'Phineas',
      lastName: 'Flynn',
      queryFirstName: 'phineas',
      queryLastName: 'flynn',
      assets: [],
      createdBy: 'Dat',
      systemIds: ['wub'],
      created: '2019-06-09T15:46:47.857Z',
      dob: '2000-06-09',
      vulnerabilities: [],
      id: '1'
    });
    cy.setHackneyCookie(true);
  });

  afterEach(() => {
    cy.task('deleteReferral', '1');
  });

  xit("Adds resources to the summary list", () => {
    cy.visit(`/referrals/1`);
    cy.get('[data-testid=accordion-item]').eq(0).click();
    cy.get('[data-testid=food-needs-v-halal-checkbox]').click();

    cy.get('[data-testid=resource-rec2FkHGEn9BiiXvW] > h3').eq(0)
      .should('contain', 'Made Up Kitchen')
    cy.get('#summary-recisR36NAVBna3N4').click()
    cy.get('#input-recisR36NAVBna3N4').check()
    cy.get('[data-testid=finish-and-save-button]').click();

    cy.get('[data-testid=resources-summary]')
      .should('contain', 'Resources')
      .and('contain', 'Shirdi Sai Baba Temple');
  })

  xit("Adds and removes resources to the summary list", () => {
    cy.visit(`/referrals/1`);
    cy.get('[data-testid=accordion-item]').eq(0).click();
    cy.get('[data-testid=food-needs-v-halal-checkbox]').click();

    cy.get('[data-testid=resource-rec2FkHGEn9BiiXvW] > h3').eq(0)
      .should('contain', 'Made Up Kitchen')
    cy.get('#summary-recisR36NAVBna3N4').click()
    cy.get('#input-recisR36NAVBna3N4').check()
    cy.get('[data-testid=finish-and-save-button]').click();

    cy.get('[data-testid=resources-summary]')
      .should('contain', 'Resources')
      .and('contain', 'Shirdi Sai Baba Temple');
  })

  describe('Edit referral', () => {
    xit('Displays editable referral if there are no assets, vulnerabilites and notes added', () => {
      cy.visit(`/referrals/1`);

      cy.contains(`Phineas's resources`).should('be.visible')


      cy.get('[data-testid=accordion-item]')
        .should('contain', 'Financial stability')
        .and('contain', 'Physical health')
        .and('contain', 'Mental health')
        .and('contain', 'Behaviour and engagement')
        .and('contain', 'Relationships and support network')
        .and('contain', 'Life events and transitions');

      cy.get('[data-testid=notes]').should('exist');
      cy.get('[data-testid=notes] > textarea').should(
        'have.attr',
        'id',
        'notes'
      );

      cy.get('[data-testid=finish-and-save-button]').should(
        'contain',
        'Finish & save'
      );
    });

    xit('Ranks resources by relevance', () => {
      cy.visit(`/referrals/1`);
      cy.get('[data-testid=accordion-item]').eq(0).click();
      cy.get('[data-testid=food-needs-v-halal-checkbox]').click();

      cy.get('[data-testid=resource-rec2FkHGEn9BiiXvW] > h3').eq(0)
        .should('contain', 'Made Up Kitchen')

      cy.get('[data-testid=food-needs-v-vegetarian-checkbox]').click();
      cy.get('[data-testid=resource-rec2FkHGEn9BiiXvW] > h3').eq(0)
        .should('contain', 'Made Up Kitchen')

    });

    xit('Adds vulnerabilities, assets and notes', () => {
      cy.visit(`/referrals/1`);
      cy.get('[data-testid=accordion-item]').eq(1).click();
      cy.get(
        '[data-testid=financial-stability-v-rent-arrears-checkbox]'
      ).click();

      cy.get('[data-testid=accordion-item]').eq(5).click();
      cy.get(
        '[data-testid=behaviour-and-engagement-a-organised-and-or-engaged-checkbox]'
      ).click();

      cy.get('textarea').click().type('Note');

      cy.get('[data-testid=finish-and-save-button]').click();

      cy.get('[data-testid=vulnerabilities-summary]')
        .should('contain', 'Vulnerabilities')
        .and('contain', 'Rent arrears');

      cy.get('[data-testid=assets-summary]')
        .should('contain', 'Strengths identified')
        .and('contain', 'Organised and/or engaged');

      cy.get('[data-testid=notes-summary]')
        .should('contain', 'Note');
    });

    xit('Persists the referral', () => {
      cy.task('createReferral', {
        firstName: 'Phineas',
        lastName: 'Flynn',
        queryFirstName: 'phineas',
        queryLastName: 'flynn',
        assets: [],
        createdBy: 'Dat',
        systemIds: ['123'],
        created: '2019-06-09T15:46:47.857Z',
        dob: '2000-06-09',
        vulnerabilities: [{ name: 'yup', data: [] }],
        id: '2'
      });
      cy.visit(`/referrals/2`);

      cy.get('[data-testid=vulnerabilities-summary]')
        .should('contain', 'Vulnerabilities')
        .and('contain', 'yup');

      cy.task('deleteReferral', '2');
    });
  });

  describe('Text input', () => {
    xit('Adds text input values to the active case vulnerability', () => {
      const baseServicesSelector =
        'support-needs-v-active-case-with-other-services-\\(e\\.g\\.-adult-social-care\\,-childrens\\)';
      cy.visit(`/referrals/1`);
      cy.get('[data-testid=accordion-item]').eq(4).click();
      cy.get(`#${baseServicesSelector}`).click();

      cy.get(`#${baseServicesSelector}-service-i`).click().type('sample');

      cy.get(`#${baseServicesSelector}-contact-name-i`).click().type('wubwub');

      cy.get(`#${baseServicesSelector}-phone-number-i`)
        .click()
        .type('0700000000000');

      cy.get('[data-testid=finish-and-save-button]').click();

      cy.get('[data-testid=vulnerabilities-summary]')
        .should('contain', 'Vulnerabilities')
        .and('contain', 'Service: sample')
        .and('contain', 'Contact name: wubwub')
        .and('contain', 'Phone number: 0700000000000');
    });

    xit('Adds text input values to the Other vulnerabilities and Other assets', () => {
      const otherVulnerabilityInputSelector =
        'financial-stability-v-other--i';
      const otherAssetInputSelector =
        'financial-stability-a-other--i';
      cy.visit(`/referrals/1`);
      cy.get('[data-testid=accordion-item]').eq(1).click();
      cy.get('[data-testid=financial-stability-v-other-checkbox]').click();
      cy.get(`#${otherVulnerabilityInputSelector}`).type('new vulnerability');
      cy.get('[data-testid=accordion-item]').eq(1).click();
      cy.get('[data-testid=financial-stability-a-other-checkbox]').click();
      cy.get(`#${otherAssetInputSelector}`).type('new asset');

      cy.get('[data-testid=finish-and-save-button]').click();
      cy.get('[data-testid=vulnerabilities-summary]')
        .should('contain', 'Vulnerabilities')
        .and('contain', 'new vulnerability');
      cy.get('[data-testid=assets-summary]')
        .should('contain', 'Strengths identified')
        .and('contain', 'new asset');
    });
  });

  describe('Back button', () => {
    xit('Sends the user back to Support For Hackney Residents', () => {
      cy.visit(`/referrals/1`);
      cy.get('[data-testid=back-link-test]')
        .should('contain', 'Back')
        .and(
          'have.attr',
          'href',
          'https://inh-admin-test.hackney.gov.uk/help-requests/edit/wub'
        );
    });
  });
});
