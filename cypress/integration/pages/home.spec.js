/// <reference types="cypress" />
context('Support a resident page', () => {
  before(() => {
    cy.visit('/support-a-resident');
    cy.injectAxe();
  });

  describe('Page structure', () => {
    it('has the right headings', () => {
      cy.contains('Personalise').should('be.visible');
    });

    it('displays the search-box', () => {
      cy.contains('Additional needs').should('be.visible');
      cy.get('[data-testid=keyword-search-button]').should('be.visible');
      cy.runCheckA11y();
    });
  });

  describe('Categories', () => {
    it('shows category headers containing resources', () => {
      cy.get('[data-testid=search-results-container]').should('not.exist');

      cy.get('[data-testid=category-checkbox]').eq(0).click();

      cy.get('[data-testid=keyword-search-button]').click();

      cy.get('[data-testid=search-results-container]').should('contain', 'First service');

      cy.get('[data-testid=category-checkbox]').eq(1).click();

      cy.get('[data-testid=category-checkbox]').eq(0).click();

      cy.get('[data-testid=keyword-search-button]').click();

      cy.get('[data-testid=search-results-container]').should('not.contain', 'Second service');
      cy.get('[data-testid=search-results-container]').should('contain', 'First service');
      cy.runCheckA11y();
    });
  });

  describe('Resources', () => {
    it('shows category headers containing resources', () => {
      cy.get('[data-testid=category-label]').should('have.length', 3);
      cy.get('[data-testid=category-label]')
        .should('contain', 'First category')
        .and('contain', 'Second category')
        .and('contain', 'Third category');
    });

    it('does not show category headers without resources', () => {
      cy.get('[data-testid=category-checkbox]').should('not.contain', 'Fourth category');
    });

    it('Displays the resources', () => {
      cy.get('[data-testid=category-checkbox]').eq(0).click();

      cy.get('[data-testid=keyword-search-button]').click();

      cy.get('[data-testid=resource-card-header]').should('have.length', 5);

      cy.get('[data-testid=resource-1]').eq(0).should('contain', 'First service');

      cy.get('[data-testid=resource-2]').eq(0).should('contain', 'Second service');
    });

    it('Does not show demographics label when there are no demographics', () => {
      cy.get('[data-testid=category-checkbox]').eq(1).click();

      cy.get('[data-testid=keyword-search-button]').click();

      cy.get('[data-testid=resource-2]').eq(0).should('contain', 'Second service');

      cy.get('[data-testid=resource-1]').eq(0).should('contain', 'This is for');

      cy.get('[data-testid=resource-2]').eq(0).should('not.contain', 'This is for');
    });

    it('Displays the correct resource information for council resources', () => {
      cy.get('[data-testid=category-checkbox]').eq(0).click();

      cy.get('[data-testid=keyword-search-button]').click();

      cy.get('[data-testid=resource-ABC123]')
        .eq(0)
        .should('contain', 'ABC  mental health Test')
        .and('contain', '123456421')
        .and('contain', 'test@abc.testy.com')
        .and('contain', 'Description for ABC  mental health Test services')
        .and('contain', 'This is for')
        .and('contain', 'this is for you')
        .and('contain', 'some details')
        .and('contain', '101 Test Ln, Hackney');

      cy.get('[data-testid=resource-ABC123]')
        .find('[data-testid=resource-card-header] > a')
        .first()
        .should('have.attr', 'href', 'https://sample.com/test_mental_health')
        .and('have.attr', 'target', '_blank');
    });

    it('Displays the correct resource information for FSS resources', () => {
      cy.get('[data-testid=category-checkbox]').eq(0).click();

      cy.get('[data-testid=keyword-search-button]').click();

      cy.get('[data-testid=resource-1]')
        .eq(0)
        .should('contain', 'First service')
        .and('contain', '07000 0000000')
        .and('contain', 'help@gmail.com')
        .and('contain', 'First service description')
        .and('contain', 'This is for')
        .and('contain', 'Housing advice, Cultural')
        .and('contain', 'Help with first category from the first service')
        .and('contain', '404 error, not, found');

      cy.get('[data-testid=resource-1]')
        .find('[data-testid=resource-card-header] > a')
        .first()
        .should('have.attr', 'href', 'https://www.sample.org.uk')
        .and('have.attr', 'target', '_blank');
    });

    it('Displays only the Create Referral button if both an email and website exist in service data', () => {
      cy.get('[data-testid=category-checkbox]').eq(0).click();

      cy.get('[data-testid=keyword-search-button]').click();

      cy.get('[data-testid=resource-abc]').eq(0).should('contain', 'Kingsman');

      cy.get('[data-testid=resource-abc]')
        .find('[data-testid=refer-button]')
        .first()
        .should('contain', 'Create Referral');

      cy.get('[data-testid=resource-abc]').find('[data-testid=refer-link]').should('not.exist');

      cy.get('[data-testid=resource-2]').find('[data-testid=refer-text]').should('not.exist');
    });

    it('Displays only the Referral Link if only a website exists in service data', () => {
      cy.get('[data-testid=category-checkbox]').eq(0).click();

      cy.get('[data-testid=keyword-search-button]').click();

      cy.get('[data-testid=resource-2]').eq(0).should('contain', 'Second service');

      cy.get('[data-testid=resource-2]').find('[data-testid=refer-text]').should('not.exist');

      cy.get('[data-testid=resource-2]')
        .find('[data-testid=refer-link]')
        .first()
        .should('have.attr', 'href', 'http://referal.form2.com')
        .and('have.attr', 'target', '_blank');
    });

    it('Clicking Create Referral opens a form that will send to the correct email address', () => {
      cy.get('[data-testid=category-checkbox]').eq(0).click();

      cy.get('[data-testid=keyword-search-button]').click();

      cy.get('[data-testid=resource-abc]').eq(0).should('contain', 'Kingsman');

      cy.get('[data-testid=resource-abc]').find('[data-testid=refer-button]').click();

      cy.get('[data-testid=resource-abc]')
        .find('input[name="service-referral-email"]')
        .should('have.attr', 'value', 'elena@madetech.com');

      cy.get('[data-testid=resource-abc]')
        .find('input[name="service-contact-email"]')
        .should('have.attr', 'value', 'service@test.testy.com');
      cy.runCheckA11y();
    });
  });

  describe('Search', () => {
    it('shows all resources if the search input is empty and no categories selected', () => {
      cy.get('[data-testid="keyword-search-button"]').click();

      cy.get('[data-testid="search-results-container"]')
        .find('[data-testid="resource-card-header"]')
        .should('have.length', 7);

      cy.get('[data-testid="show-more-button"]').should('not.exist');

      cy.runCheckA11y();
    });

    it('shows empty text if no results', () => {
      cy.get('[data-testid="keyword-search"]').clear();

      cy.get('[data-testid="keyword-search"]').type('sdjkfhdjksfhdjsfhjdksf');
      cy.get('[data-testid="keyword-search-button"]').click();

      cy.get('[data-testid="results-text"]').should('contain', 'Your search returned no results.');

      cy.get('[data-testid="show-more-button"]').should('not.exist');
    });

    it('press enter when focus is in input will also search', () => {
      cy.get('[data-testid="keyword-search"]').clear();

      cy.get('[data-testid="keyword-search"]').type('kingsman {enter}');
      cy.get('[data-testid="search-results-container"]')
        .find('[data-testid="resource-card-header"]')
        .should('have.length', 1);
    });

    it('returns only services containing search term', () => {
      cy.get('[data-testid="keyword-search"]').clear();

      cy.get('[data-testid="keyword-search"]').type('abc');
      cy.get('[data-testid="keyword-search-button"]').click();

      cy.get('[data-testid=resource-ABC123]').contains('ABC mental health Test');
    });

    it('returns services ordered by full match then individual word match', () => {
      cy.get('[data-testid="keyword-search"]').clear();

      const searchTerm = 'Second service';
      cy.get('[data-testid="keyword-search"]').type(searchTerm);
      cy.get('[data-testid="keyword-search-button"]').click();

      cy.get('[data-testid="search-results-container"]')
        .find('[data-testid="resource-card-header"]')
        .first()
        .should('contain', 'Second')
        .and('contain', 'service');
    });

    it('returns services matched on a synonym', () => {
      cy.get('[data-testid="keyword-search"]').clear();

      const searchTerm = 'testsynonym';
      cy.get('[data-testid="keyword-search"]').type(searchTerm);
      cy.get('[data-testid="keyword-search-button"]').click();

      cy.get('[data-testid="search-results-container"]')
        .find('[data-testid="resource-card-header"]')
        .first()
        .should('contain', 'Second service');
    });
  });

  describe('Add to summary', () => {
    it('persists checked summaries across different service views', () => {
      cy.get('[data-testid=category-checkbox]').eq(1).click();

      cy.get('[data-testid="keyword-search"]').clear();

      cy.get('[data-testid=keyword-search-button]').click();

      cy.get('#add-to-summary-checkbox-1').should('not.be.checked');

      cy.get('#add-to-summary-checkbox-1').click();

      cy.get('#add-to-summary-checkbox-1').should('be.checked');

      cy.get('[data-testid=category-checkbox]').eq(2).click();

      cy.get('[data-testid=category-checkbox]').eq(1).click();
      cy.get('#add-to-summary-checkbox-1').should('be.checked');
      cy.runCheckA11y();
    });
  });

  describe('navigation', () => {
    it('Redirects to my view when it is selected from the navigation', () => {
      cy.get('[data-testid=my-view-nav]').click({ force: true });
      cy.url().should('include', '/my-view');
    });
  });

  describe('Specific Needs', () => {
    it('shows correct specific needs checkboxes', () => {
      cy.visit('/support-a-resident');

      cy.get('[data-testid=search-results-container]').should('not.exist');

      const searchTerm = 'First service';
      cy.get('[data-testid="keyword-search"]').type(searchTerm);

      cy.get('[data-testid=keyword-search-button]').click();

      cy.get('[data-testid=search-results-container]').should('contain', 'First service');

      cy.get('[data-testid=search-results-container]').should('not.contain', 'mrzombie');

      cy.get('[data-testid=specific-needs-checkbox]').eq(0).click();

      cy.get('[data-testid=keyword-search-button]').click();

      cy.get('[data-testid=search-results-container]').should('contain', 'First service');

      cy.get('[data-testid=search-results-container]').should('contain', 'mrzombie');
    });
  });
});
