const selectors = {
  banner: '[data-testid=cookie-banner]',
  acceptButton: '[data-testid=cookies-yes-button]',
  declineButton: '[data-testid=cookies-no-button]'
};

context('Cookie consent banner', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('on first visit to the app', () => {
    beforeEach(() => {
      cy.clearCookies();
    });

    it('displays the cookie consent banner', () => {
      cy.get(selectors.banner).should('be.visible');
      cy.get(selectors.acceptButton).should('be.visible');
      cy.get(selectors.declineButton).should('be.visible');
    });

    it('declines cookies when decline is clicked', () => {
      cy.get(selectors.declineButton).click();
      cy.get(selectors.banner).should('not.exist');
      cy.getCookie('cookie_opt_in').should('not.exist');
      cy.getCookie('seen_cookie_message').should('have.property', 'value', 'true');
    });

    it('accepts cookies when accept is clicked', () => {
      cy.get(selectors.acceptButton).click();
      cy.get(selectors.banner).should('not.exist');
      cy.getCookie('cookie_opt_in').should('have.property', 'value', 'true');
      cy.getCookie('seen_cookie_message').should('have.property', 'value', 'true');
    });
  });

  describe('when banner has already been seen', () => {
    beforeEach(() => {
      cy.setCookie('seen_cookie_message', 'true');
      cy.reload(); // reload the page now that cookie is set!
    });

    it('does not display the cookie banner', () => {
      cy.get(selectors.banner).should('not.exist');
    });
  });

  describe('when analytics cookies have already dropped', () => {
    beforeEach(() => {
      cy.setCookie('_ga', 'UA-XXXXXXXXX');
      cy.setCookie('_gid', 'GAX.X.XXXXXXXXXXX.XXXXXXXXXX');
      cy.reload();
    });

    it('removes analytics cookies after declining', () => {
      cy.get(selectors.declineButton).click();
      cy.getCookie('_ga').should('not.exist');
      cy.getCookie('_gid').should('not.exist');
    });
  });
});
