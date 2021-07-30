import css from './index.module.scss';
import notificationCss from '../../notification-messages.module.scss';
import { useState } from 'react';
import { sendDataToAnalytics, getUserGroup } from 'lib/utils/analytics';
import {
  REFERRAL_OPEN,
  REFERRAL_CLICK_WEBSITE,
  SERVICE_CLICK_WEBSITE,
  VIEW_SUMMARY_EMAIL_CLICKED
} from 'lib/utils/constants';
import ReferralForm from 'components/Feature/ReferralForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const ResourceCard = ({
  updateSelectedResources,
  residentInfo,
  categoryId,
  referralCompletion,
  setReferralCompletion,
  detailsClicked,
  openReferralForm,
  referralData,
  setReferralData,
  referrerData,
  setReferrerData,
  updateSignpostSummary,
  signpostSummary,
  setResidentInfo,
  token,
  referralSummary,
  setReferralSummary,
  updateEmailBody,
  setEmailBody,
  setPreserveFormData,
  preserveFormData,
  resource,
  wordsToHighlight,
  ...others
}) => {
  const [noteOpen, setNoteOpen] = useState(false);

  const trimLength = (s, length) => (s.length > length ? s.substring(0, length) + '...' : s);

  const wrapKeywordWithHTML = keyword => {
    return `<mark> ${keyword} </mark>`;
  };

  const getHighlighted = text => {
    if (wordsToHighlight && wordsToHighlight.some(x => text.includes(x))) {
      let newString = text;
      wordsToHighlight.forEach(
        term => (newString = newString.replace(new RegExp(term, 'g'), wrapKeywordWithHTML(term)))
      );
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: newString
          }}></div>
      );
    }
    return text;
  };
  const tagsElement = resource.tags.map(item => (
    <span key={'tags-' + item} className={`${css.tags} tag-element`}>
      {getHighlighted(trimLength(item, 20))}
    </span>
  ));
  const councilTagsElement = resource.councilTags.map(item => (
    <span key={'tags-' + item} className={`${css.tags} tag-element ${css[`Council-tag`]}`}>
      {getHighlighted(trimLength(item, 20))}
    </span>
  ));
  const updateResource = () => {
    updateSelectedResources({
      name: resource.name,
      description: resource.description,
      address: resource.address,
      telephone: resource.telephone,
      email: resource.email,
      referralContact: resource.referralContact,
      websites: resource.websites,
      notes: resource.notes
    });
  };

  const fullDescription = [resource.serviceDescription, resource.description].join(' ');
  const first = fullDescription?.substring(0, 250);
  const second = fullDescription?.substring(250);

  return (
    <div
      className={`resource ${css.resource}`}
      {...others}
      id={`resource-container-${resource.id}`}>
      <div className={`${css.tags__container} card-header-tag`} data-testid="resource-card-tags">
        {tagsElement}
        {councilTagsElement}
      </div>
      <div>
        <div className={`govuk-grid-row`}>
          <div
            className={`govuk-grid-column-two-thirds header-container ${css['header-container']}`}>
            <h3 data-testid="resource-card-header">
              {resource.websites?.length > 0 ? (
                <>
                  <a
                    key={`website-link-${resource.websites[0]}`}
                    href={resource.websites[0]}
                    target="_blank"
                    onClick={() => {
                      sendDataToAnalytics({
                        action: getUserGroup(referrerData['user-groups']),
                        category: SERVICE_CLICK_WEBSITE,
                        label: resource.name
                      });
                    }}
                    rel="noopener noreferrer">
                    {getHighlighted(resource.name)}
                  </a>{' '}
                  <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-6" />
                </>
              ) : (
                getHighlighted(resource.name)
              )}
            </h3>
            {resource.demographic?.trim().length > 0 && (
              <span>This is for {getHighlighted(resource.demographic)}</span>
            )}
          </div>

          <div className={`govuk-grid-column-one-third ${css['contact-container']}`}>
            {resource.telephone?.length > 0 && <h4>{resource.telephone}</h4>}

            {resource.email?.includes('@') && (
              <div>
                <a href={`mailto:${resource.email}`}>{resource.email}</a>
              </div>
            )}

            {resource.address?.length > 0 && <span>{resource.address}</span>}
          </div>
        </div>
        {fullDescription && (
          <p>
            {getHighlighted(first)}
            {second.length > 0 && !noteOpen ? (
              <>
                ...
                <button onClick={() => setNoteOpen(true)} className={css['toggle-button']}>
                  Show more
                </button>
              </>
            ) : (
              ''
            )}
            {noteOpen && getHighlighted(second)}
            {noteOpen && (
              <button onClick={() => setNoteOpen(false)} className={css['toggle-button']}>
                Show less
              </button>
            )}
          </p>
        )}
        <div className={`govuk-grid-row`}>
          <div className={`govuk-grid-column-one-half`}>
            <div className={`govuk-checkboxes__item ${css['inline-header']}`}>
              <fieldset className="govuk-fieldset" role="group">
                <input
                  className="govuk-checkboxes__input"
                  id={`add-to-summary-checkbox-${resource.id}-${categoryId}`}
                  name="add-to-summary-checkbox"
                  type="checkbox"
                  onClick={() => {
                    updateSignpostSummary({
                      id: resource.id,
                      name: resource.name,
                      telephone: resource.telephone,
                      contactEmail: resource.email,
                      referralEmail: resource.referralContact,
                      address: resource.address,
                      websites: resource.websites.join(', '),
                      categoryName: resource.categoryName
                    });
                  }}
                  value={true}
                  checked={signpostSummary?.some(x => x.name == resource.name)}
                />
                <label
                  className={`govuk-label govuk-checkboxes__label ${css['checkbox-label']}`}
                  htmlFor={`add-to-summary-checkbox-${resource.id}-${categoryId}`}>
                  Share service with a resident
                </label>
                <legend hidden>Share service with a resident</legend>
              </fieldset>
            </div>
          </div>
          <div>
            {resource.referralContact?.length > 0 ? (
              <span id={`referral-${resource.id}-${categoryId}-details`} name="refer-details">
                {(openReferralForm.id != resource.id ||
                  openReferralForm.categoryName != resource.categoryName) && (
                  <button
                    id={`referral-${resource.id}-${categoryId}`}
                    className={`govuk-button ${css['refer-button']}`}
                    type="button"
                    data-testid="refer-button"
                    onClick={e => {
                      detailsClicked(
                        e,
                        `referral-${resource.id}-${categoryId}-details`,
                        resource.id,
                        resource.categoryName
                      );
                      sendDataToAnalytics({
                        action: getUserGroup(referrerData['user-groups']),
                        category: REFERRAL_OPEN,
                        label: resource.name
                      });
                    }}>
                    Create Referral
                  </button>
                )}
                {openReferralForm.id == resource.id &&
                  openReferralForm.categoryName == resource.categoryName && (
                    <button
                      id={`referral-${resource.id}-${categoryId}`}
                      className={`govuk-button ${css['refer-button']} govuk-button--secondary`}
                      type="button"
                      data-testid="refer-button"
                      onClick={e =>
                        detailsClicked(
                          e,
                          `referral-${resource.id}-${categoryId}-details`,
                          resource.id,
                          resource.categoryName
                        )
                      }>
                      Cancel
                    </button>
                  )}
                {openReferralForm.id == resource.id &&
                  openReferralForm.categoryName == resource.categoryName &&
                  (referralCompletion[resource.id] ? (
                    <div className={`govuk-!-padding-top-8`}>
                      {referralCompletion[resource.id].errors?.length > 0 && (
                        <div
                          data-testid="referral-errors-banner"
                          className={`${notificationCss['error-message']}`}>
                          {referralCompletion[resource.id].errors.join('\n')}
                        </div>
                      )}
                      {!referralCompletion[resource.id].errors?.includes(
                        'Failed to send referral email to service'
                      ) && (
                        <div
                          data-testid="successful-referral-banner"
                          className={`${notificationCss['success-message']}`}>
                          Successfully submitted referral for {residentInfo?.firstName}{' '}
                          {residentInfo?.lastName}
                        </div>
                      )}
                      <button
                        type="button"
                        className={`govuk-button ${notificationCss['notification-button']}`}
                        onClick={e => {
                          setPreserveFormData(true);
                          detailsClicked(
                            e,
                            `referral-${resource.id}-${categoryId}-details`,
                            resource.id,
                            resource.categoryName
                          );
                        }}
                        data-testid="continue-call-button">
                        Continue Call
                      </button>
                      <button
                        type="button"
                        className={`govuk-button ${notificationCss['notification-button']}`}
                        onClick={() => (window.location = process.env.NEXT_PUBLIC_URL)}
                        data-testid="finish-call-button">
                        Finish Call
                      </button>
                    </div>
                  ) : (
                    <div
                      id={`referral-${resource.id}-${categoryId}-form`}
                      className={css['referral-form']}>
                      <ReferralForm
                        setResidentInfo={setResidentInfo}
                        token={token}
                        setReferralCompletion={setReferralCompletion}
                        referralCompletion={referralCompletion}
                        referralSummary={referralSummary}
                        setReferralSummary={setReferralSummary}
                        updateEmailBody={updateEmailBody}
                        setEmailBody={setEmailBody}
                        referrerData={referrerData}
                        resource={resource}
                        referralData={referralData}
                        setReferrerData={setReferrerData}
                        setReferralData={setReferralData}
                        preserveFormData={preserveFormData}
                        setPreserveFormData={setPreserveFormData}
                        residentInfo={residentInfo}
                        detailsClicked={detailsClicked}
                        categoryId={categoryId}
                      />
                    </div>
                  ))}
              </span>
            ) : (
              resource.referralWebsite?.length > 0 &&
              (resource.referralWebsite.startsWith('http') ? (
                <a
                  href={resource.referralWebsite}
                  target="_blank"
                  onClick={() =>
                    sendDataToAnalytics({
                      action: getUserGroup(referrerData['user-groups']),
                      category: REFERRAL_CLICK_WEBSITE,
                      label: resource.name
                    })
                  }
                  data-testid="refer-link"
                  className={css['refer-link']}>
                  Refer via external website
                </a>
              ) : (
                <span className={css['refer-text']} data-testid="refer-text">
                  <h4>Referral information</h4>
                  <span>{resource.referralWebsite}</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
      {signpostSummary?.some(x => x.name == resource.name) && (
        <div
          className={`${css['success-message']}`}
          data-testid={`added-to-summary-banner-${resource.id}-${categoryId}`}>
          You have added a service to your summary message
          <a
            className={`${css['summary-link']}`}
            href="#summary-header"
            onClick={() => {
              document.getElementById('span-summary-form').click();
              sendDataToAnalytics({
                action: getUserGroup(referrerData['user-groups']),
                category: VIEW_SUMMARY_EMAIL_CLICKED,
                label: resource.name
              });
            }}>
            View summary message
          </a>
        </div>
      )}
      <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
    </div>
  );
};

export default ResourceCard;
