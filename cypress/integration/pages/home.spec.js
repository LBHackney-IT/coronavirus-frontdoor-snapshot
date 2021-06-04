/// <reference types="cypress" />
context('Index page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  describe('Page structure', () => {
    it('has the right headings', () => {
      cy.contains('Explore categories').should('be.visible');
    });

    it('displays the search-box', () => {
      cy.contains('Search for support').should('be.visible');
      cy.get('[data-testid=keyword-search]').should('be.visible');
    });

    it('has no content outside top-level headings', () => {
      cy.checkA11y('#content > h2', null, cy.terminalLog);
    });
  });

  describe('Categories', () => {
    it('shows category headers containing resources', () => {
      cy.get('[data-testid=search-results-header]').should('not.exist');

      cy.get('[data-testid=category-card]')
        .eq(0)
        .click();

      cy.get('[data-testid=search-results-header]').should('contain', 'First category');

      cy.get('[data-testid=category-card]')
        .eq(1)
        .click();

      cy.get('[data-testid=search-results-header]').should('not.contain', 'First category');
      cy.get('[data-testid=search-results-header]').should('contain', 'Second category');
    });
  });

  describe('Resources', () => {
    it('shows category headers containing resources', () => {
      cy.get('[data-testid=category-card]').should('have.length', 3);
      cy.get('[data-testid=category-card]')
        .should('contain', 'First category')
        .and('contain', 'Second category')
        .and('contain', 'Third category');
    });

    it('does not show category headers without resources', () => {
      cy.get('[data-testid=category-card]').should('not.contain', 'Fourth category');
    });

    it('Displays the resources', () => {
      cy.get('[data-testid=category-card]')
        .eq(0)
        .click();

      cy.get('[data-testid=resource-card-header]').should('have.length', 5);

      cy.get('[data-testid=resource-1]')
        .eq(0)
        .should('contain', 'First service');

      cy.get('[data-testid=resource-2]')
        .eq(0)
        .should('contain', 'Second service');
    });

    it('Displays the correct tags', () => {
      cy.get('[data-testid=category-card]')
        .eq(0)
        .click();

      cy.get('[data-testid=resource-card-tags]')
        .eq(0)
        .should('contain', 'First category')
        .and('contain', 'Magic')
        .children()
        .should('have.length', 2);

      cy.get('[data-testid=resource-card-tags]')
        .eq(2)
        .should('contain', 'First category')
        .and('contain', 'Second category')
        .children()
        .should('have.length', 2);
    });

    it('Displays the correct resource information for council resources', () => {
      cy.get('[data-testid=category-card]')
        .eq(0)
        .click();

      cy.get('[data-testid=resource-ABC123]')
        .eq(0)
        .should('contain', 'ABC  mental health Test')
        .and('contain', 'Telephone')
        .and('contain', '123456421')
        .and('contain', 'Email')
        .and('contain', 'test@abc.testy.com')
        .and('contain', 'Description')
        .and('contain', 'Description for ABC  mental health Test services')
        .and('contain', "Who's this for?")
        .and('contain', 'this is for you')
        .and('contain', 'Relevant support')
        .and('contain', 'some details')
        .and('contain', 'Address')
        .and('contain', '101 Test Ln, Hackney')
        .and('contain', 'Website')
        .and('contain', 'https://sample.com/test_mental_health')
        .and('contain', 'https://sample.com/test_mental_health_too')
        .and('contain', 'Online referral')
        .and('contain', 'https://www.test.abc.com');
    });

    it('Displays the correct resource information for FSS resources', () => {
      cy.get('[data-testid=category-card]')
        .eq(0)
        .click();

      cy.get('[data-testid=resource-1]')
        .eq(0)
        .should('contain', 'First service')
        .and('contain', 'Telephone')
        .and('contain', '07000 0000000')
        .and('contain', 'Email')
        .and('contain', 'help@gmail.com')
        .and('contain', 'Description')
        .and('contain', 'First service description')
        .and('contain', "Who's this for?")
        .and('contain', 'Housing advice, Cultural')
        .and('contain', 'Relevant support')
        .and('contain', 'Help with first category from the first service')
        .and('contain', 'Address')
        .and('contain', '404 error, not, found')
        .and('contain', 'Website')
        .and('contain', 'https://www.sample.org.uk')
        .and('contain', 'Online referral')
        .and('contain', 'referal.form.com');
    });
  });

  describe('Search', () => {
    it('shows all resources if the search input is empty', () => {
      cy.get('[data-testid="keyword-search-button"]').click();

      cy.get('[data-testid="search-results-header"]').should('contain', '7 results');
    });

    it('shows singular text if only 1 result returned', () => {
      cy.get('[data-testid="keyword-search"]').type('abc mental health');
      cy.get('[data-testid="keyword-search-button"]').click();

      cy.get('[data-testid="search-results-header"]').should('contain', '1 result');
      cy.get('[data-testid="search-results-header"]').should('not.contain', '1 results');
    });

    it('shows plural text if no results', () => {
      cy.get('[data-testid="keyword-search"]').type('sdjkfhdjksfhdjsfhjdksf');
      cy.get('[data-testid="keyword-search-button"]').click();

      cy.get('[data-testid="search-results-header"]').should('contain', '0 results');
    });

    it('press enter when focus is in input will also search', () => {
      cy.get('[data-testid="keyword-search"]').type('kingsman {enter}');
      cy.get('[data-testid="search-results-header"]').should('contain', '1 result');
    });

    it('returns only services containing search term', () => {
      cy.get('[data-testid="keyword-search"]').type('abc');
      cy.get('[data-testid="keyword-search-button"]').click();

      cy.get('[data-testid="search-results-container"]')
        .find('[data-testid="resource-card-tags"]')
        .should('have.length', 1);

      cy.get('[data-testid="resource-card-tags"]').should('contain', 'Magic');
      cy.get('[data-testid="resource-card-tags"]').should('contain', 'First category');
    });

    it('returns services ordered by full match then individual word match', () => {
      const searchTerm = 'Second service';
      cy.get('[data-testid="keyword-search"]').type(searchTerm);
      cy.get('[data-testid="keyword-search-button"]').click();

      cy.get('[data-testid="search-results-container"]')
        .find('[data-testid="resource-card-header"]')
        .first()
        .should('contain', searchTerm);
    });
  });
});
