import R from 'ramda';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import getTime from 'date-fns/get_time';

import {
  REQUEST_START,
  REQUEST_SUCCESS,
  REQUEST_ERROR,
  SET_DATE,
} from './constants';

import nba from '../../utils/nba';

const requestStart = () => ({ type: REQUEST_START });
const requestError = () => ({ type: REQUEST_ERROR });
const requestSuccess = scheduleData => ({
  type: REQUEST_SUCCESS,
  payload: { scheduleData },
});

const setDate = date => ({
  type: SET_DATE,
  payload: { date },
});

export const fetchData = (date, type) => async dispatch => {
  dispatch(requestStart());

  let newDate;

  R.ifElse(
    R.equals('today'),
    () => {
      newDate = date;
    },
    R.ifElse(
      R.equals('add'),
      () => {
        newDate = getTime(addDays(date, 1));
      },
      () => {
        newDate = getTime(subDays(date, 1));
      }
    )
  )(type);

  dispatch(setDate(newDate));

  try {
    const {
      sports_content: { games: { game: gamesData } },
    } = await nba.getGamesFromDate(newDate);

    const scheduleData = R.map(
      gameData => ({
        id: gameData.id,
        time: gameData.id,
        state: gameData.state,
        city: gameData.city,
        arena: gameData.arena,
        home: gameData.home,
        visitor: gameData.visitor,
        periodTime: {
          periodStatus: gameData.period_time.period_status,
          gameClock: gameData.period_time.game_clock,
          gameStatus: gameData.period_time.game_status,
        },
      }),
      gamesData
    );

    console.log(scheduleData);

    dispatch(requestSuccess(scheduleData));
  } catch (error) {
    dispatch(requestError());
  }
};
