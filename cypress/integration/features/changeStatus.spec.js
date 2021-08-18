/// <reference types="cypress" />
context('status page', () => {
  describe('Accept referral', () => {
    it('shows status form', () => {
      cy.visit('/referrals/status/1');
      cy.injectAxe();

      cy.get('[data-testid=status-form-accepted-radio-item]').should('contain', 'Yes');
      cy.get('[data-testid=status-form-accepted-input]').click();
      cy.get('[data-testid=status-confirmation-panel]').should('not.exist');

      cy.get('[data-testid=submit-status-form]').click();

      cy.get('[data-testid=status-confirmation-panel]').should('contain', 'Thank you');
      cy.get('[data-testid=status-confirmation-panel]').should(
        'contain',
        'Referral reference number: E7UK-8'
      );
      cy.runCheckA11y();

      // Test the page after refresh as it's supposed to look different after the referral state is updated.
      cy.visit('/referrals/status/1');
      cy.injectAxe();

      cy.get('[data-testid=status-paragraph]').should('contain', 'This referral was ACCEPTED on');
      cy.get('[data-testid=reference-number-paragraph]').should(
        'contain',
        'Reference number: E7UK-8'
      );
      cy.resetReferralStatus('11', [
        {
          date: '2021-07-20T09:17:23.305Z',
          status: 'SENT'
        }
      ]);
      cy.runCheckA11y();
    });
  });

  describe('Reject referral', () => {
    it('should not allow to submit the form without mandatory fields selected', () => {
      cy.visit('/referrals/status/1');
      // Try submitting the form without giving an Accept/Reject answer
      cy.get('[data-testid=submit-status-form]').click();
      cy.wait(50); // wait to make sure submit has attempted to submit
      cy.url().should('include', '/referrals/status/1');
      // Try submitting a rejection without giving a rejection reason
      cy.get('[data-testid=status-form-rejected-input]').click();
      cy.get('[data-testid=submit-status-form]').click();
      cy.url().should('include', '/referrals/status/1');
    });

    it('with comment', () => {
      cy.visit('/referrals/status/1');
      cy.injectAxe();

      cy.get('[data-testid=status-form-rejected-radio-item]').should('contain', 'No');
      cy.get('[data-testid=status-form-rejected-input]').click();
      cy.get('[data-testid=status-form-rejected-comment-input]').type('comment');

      cy.get('[data-testid=status-confirmation-panel]').should('not.exist');

      cy.get('[data-testid=submit-status-form]').click();
      cy.get('[data-testid=status-confirmation-panel]').should('contain', 'Thank you');
      cy.get('[data-testid=status-confirmation-panel]').should(
        'contain',
        'Referral reference number: E7UK-8'
      );

      cy.runCheckA11y();

      // Test the page after refresh as it's supposed to look different after the referral state is updated.
      cy.visit('/referrals/status/1');
      cy.injectAxe();

      cy.get('[data-testid=status-paragraph]').should('contain', 'This referral was REJECTED on');
      cy.get('[data-testid=reference-number-paragraph]').should(
        'contain',
        'Reference number: E7UK-8'
      );
      cy.get('[data-testid=status-paragraph]').should('contain', 'with comment: "comment".');
      cy.resetReferralStatus('11', [
        {
          date: '2021-07-20T09:17:23.305Z',
          status: 'SENT'
        }
      ]);
      cy.runCheckA11y(); //
    });
  });
});
