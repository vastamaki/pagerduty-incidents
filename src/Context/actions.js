export const getTeams = () => async (dispatch) => {
  const params = {
    method: "GET",
    headers: {
      Accept: "application/vnd.pagerduty+json;version=2",
      Authorization: "Token token=" + localStorage.getItem("token"),
    },
  };

  const response = await fetch(
    encodeURI(`https://api.pagerduty.com/teams`),
    params
  );

  if (response) {
    const teams = await response.json();
    dispatch({
      type: "GET_TEAMS",
      payload: teams.teams,
    });
  }
};

export const setFilters = (name, value) => async (dispatch) => {
  dispatch({
    type: "SET_FILTERS",
    payload: {
      name,
      value,
    },
  });
};

export const clearIncidents = () => (dispatch) => {
  dispatch({
    type: "CLEAR_INCIDENTS"
  })
}

export const markHour = (incident) => (dispatch) => {
  dispatch({
    type: "SET_HOUR_MARK",
    payload: incident,
  });
};

export const getIncidents = (incidents, weekdays) => (dispatch) => {
  dispatch({
    type: "GET_INCIDENTS",
    payload: { incidents, weekdays },
  });
};
