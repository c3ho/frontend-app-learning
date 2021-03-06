import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { useModel } from '../../generic/model-store';

import DatesBanner from './DatesBanner';
import { fetchDatesTab, resetDeadlines } from '../data/thunks';

function DatesBannerContainer(props) {
  const {
    model,
  } = props;

  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    courseDateBlocks,
    datesBannerInfo,
    hasEnded,
  } = useModel(model, courseId);

  const {
    contentTypeGatingEnabled,
    missedDeadlines,
    missedGatedContent,
    verifiedUpgradeLink,
  } = datesBannerInfo;

  const {
    isSelfPaced,
  } = useModel('courses', courseId);

  const dispatch = useDispatch();
  const hasDeadlines = courseDateBlocks.some(x => x.dateType === 'assignment-due-date');
  const upgradeToCompleteGraded = model === 'dates' && contentTypeGatingEnabled && !missedDeadlines;
  const upgradeToReset = !upgradeToCompleteGraded && missedDeadlines && missedGatedContent;
  const resetDates = !upgradeToCompleteGraded && missedDeadlines && !missedGatedContent;
  const datesBanners = [
    {
      name: 'datesTabInfoBanner',
      shouldDisplay: model === 'dates' && hasDeadlines && !missedDeadlines && isSelfPaced,
    },
    {
      name: 'upgradeToCompleteGradedBanner',
      // verifiedUpgradeLink can be null if we've passed the upgrade deadline
      shouldDisplay: upgradeToCompleteGraded && verifiedUpgradeLink,
      clickHandler: () => global.location.replace(verifiedUpgradeLink),
    },
    {
      name: 'upgradeToResetBanner',
      // verifiedUpgradeLink can be null if we've passed the upgrade deadline
      shouldDisplay: upgradeToReset && verifiedUpgradeLink,
      clickHandler: () => global.location.replace(verifiedUpgradeLink),
    },
    {
      name: 'resetDatesBanner',
      shouldDisplay: resetDates,
      clickHandler: () => dispatch(resetDeadlines(courseId, fetchDatesTab)),
    },
  ];

  return (
    <>
      {!hasEnded && datesBanners.map((banner) => banner.shouldDisplay && (
        <DatesBanner
          name={banner.name}
          bannerClickHandler={banner.clickHandler}
          key={banner.name}
        />
      ))}
    </>
  );
}

DatesBannerContainer.propTypes = {
  model: PropTypes.string.isRequired,
};

export default DatesBannerContainer;
