const React = require('react');
const ContestTypeHeader = require('../ContestTypeHeader');
const ContestList = require('../ContestList');
const store = require('../../store');
const Contest = require('../../Contest');

const filterContestsByTime = (allContests) => {
  const currentTime = new Date().getTime() / 1000;
  const filteredContests = {};

  // Remove contests that are already over from ongoing contests list
  filteredContests.ongoing = allContests.ongoing.filter(({ endTime }) => (endTime > currentTime));

  // Move contests that have started, to ongoing events list
  allContests.upcoming.forEach((contest) => {
    if (contest.startTime < currentTime && contest.endTime > currentTime) {
      filteredContests.ongoing.push(contest);
    }
  });

  //  Remove contests that have started/ended from upcoming contests list
  filteredContests.upcoming = allContests.upcoming.filter(({ startTime, endTime }) => (startTime > currentTime && endTime > currentTime));

  return filteredContests;
};

const sortByStartTime = (a, b) => a.startTime - b.startTime;
const sortByEndTime = (a, b) => a.endTime - b.endTime;

const processContestList = (contests) => {
  const contestsFilteredByTime = filterContestsByTime(contests);

  return {
    ongoing: contestsFilteredByTime.ongoing
      .map(contestJson => new Contest(contestJson))
      .filter(contest => contest.shouldBeDisplayed())
      .sort(sortByEndTime),

    upcoming: contestsFilteredByTime.upcoming
      .map(contestJson => new Contest(contestJson))
      .filter(contest => contest.shouldBeDisplayed())
      .sort(sortByStartTime),
  };
};

const Listings = () => {
  const contests = processContestList(store.getContests().data);

  return (
    <div className="listings-container">
      <div id="ongoing" className="top-title">
        <ContestTypeHeader type="Live" />
        <ContestList contests={contests.ongoing} type="live" route="listings" />
      </div>
      <div id="upcoming">
        <ContestTypeHeader type="Upcoming" />
        <ContestList contests={contests.upcoming} type="upcoming" route="listings" />
      </div>
    </div>
  );
};

module.exports = Listings;
