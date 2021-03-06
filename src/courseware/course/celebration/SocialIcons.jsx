import React from 'react';
import PropTypes from 'prop-types';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';

import { getConfig } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { useModel } from '../../../generic/model-store';

function SocialIcons({ courseId, intl }) {
  const {
    marketingUrl,
    title,
  } = useModel('courses', courseId);

  if (!marketingUrl) {
    return null;
  }

  const twitterUrl = getConfig().TWITTER_URL;
  const twitterAccount = twitterUrl && twitterUrl.substring(twitterUrl.lastIndexOf('/') + 1);

  const logClick = (service) => {
    const { administrator } = getAuthenticatedUser();
    sendTrackEvent('edx.ui.lms.celebration.social_share.clicked', {
      course_id: courseId,
      is_staff: administrator,
      service,
    });
  };

  const socialUtmMarketingUrl = `${marketingUrl}?utm_campaign=edxmilestone&utm_medium=social`;

  return (
    <div className="social-icons">
      <LinkedinShareButton
        beforeOnClick={() => logClick('linkedin')}
        url={`${socialUtmMarketingUrl}&utm_source=linkedin`}
      >
        <LinkedinIcon round size={32} />
        <span className="sr-only">{intl.formatMessage(messages.shareService, { service: 'LinkedIn' })}</span>
      </LinkedinShareButton>
      { twitterAccount && (
        <TwitterShareButton
          beforeOnClick={() => logClick('twitter')}
          className="ml-2"
          hashtags={['myedxjourney']}
          title={intl.formatMessage(messages.social, { platform: `@${twitterAccount}`, title })}
          url={`${socialUtmMarketingUrl}&utm_source=twitter`}
        >
          <TwitterIcon round size={32} />
          <span className="sr-only">{intl.formatMessage(messages.shareService, { service: 'Twitter' })}</span>
        </TwitterShareButton>
      )}
      <FacebookShareButton
        beforeOnClick={() => logClick('facebook')}
        className="ml-2"
        quote={intl.formatMessage(messages.social, { platform: getConfig().SITE_NAME, title })}
        url={`${socialUtmMarketingUrl}&utm_source=facebook`}
      >
        <FacebookIcon round size={32} />
        <span className="sr-only">{intl.formatMessage(messages.shareService, { service: 'Facebook' })}</span>
      </FacebookShareButton>
      <EmailShareButton
        beforeOnClick={() => logClick('email')}
        body={`${intl.formatMessage(messages.emailBody)}\n\n`}
        className="ml-2"
        subject={intl.formatMessage(messages.emailSubject, { platform: getConfig().SITE_NAME, title })}
        url={`${marketingUrl}?utm_campaign=edxmilestone&utm_medium=email&utm_source=email`}
      >
        <EmailIcon round size={32} />
        <span className="sr-only">{intl.formatMessage(messages.shareEmail)}</span>
      </EmailShareButton>
    </div>
  );
}

SocialIcons.propTypes = {
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(SocialIcons);
