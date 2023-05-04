import * as actions from "./actions";
import * as types from "./constants";
import configureMockStore from "redux-mock-store";
import thunkMiddleware from "redux-thunk";
import nock from "nock";

export const base = "https://jsonplaceholder.typicode.com";
export const endpoint = "/users";
export const link = base + endpoint;

export const mockStore = configureMockStore([thunkMiddleware]);

describe("actions", () => {
  it("should create an action to search", () => {
    const text = "Finish docs";
    const expectedAction = {
      type: types.CHANGE_SEARCHFIELD,
      payload: text,
    };
    expect(actions.setSearchField(text)).toEqual(expectedAction);
  });
});

describe("Request robots actions", () => {
  let store;
  const mockData = { id: 3, name: "John", email: "John@example.com" };
  const mockError = "Failed to fetch data";

  beforeEach(() => {
    store = mockStore({});
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("dispatches REQUEST_ROBOTS_PENDING and REQUEST_ROBOTS_SUCCESS on successful API call", async () => {
    nock(base).get(endpoint).reply(200, mockData);

    await store.dispatch(actions.requestRobots());
    const action = store.getActions();
    expect(action).toEqual([
      { type: types.REQUEST_ROBOTS_PENDING },
      { type: types.REQUEST_ROBOTS_SUCCESS, payload: mockData },
    ]);
  });

  it("dispatches REQUEST_ROBOTS_PENDING and REQUEST_ROBOTS_FAILED on failed API call", async () => {
    nock(base).get(endpoint).replyWithError(mockError);

    await store.dispatch(actions.requestRobots());
    const action = store.getActions();
    expect(action).toEqual([
      { type: types.REQUEST_ROBOTS_PENDING },
      { type: types.REQUEST_ROBOTS_FAILED, payload: mockError },
    ]);
  });

  it("dispatches REQUEST_ROBOTS_FAILED when API call returns an error status", async () => {
    nock(base).get(endpoint).reply(404);

    await store.dispatch(actions.requestRobots());
    const action = store.getActions();
    expect(action).toEqual([
      { type: types.REQUEST_ROBOTS_PENDING },
      { type: types.REQUEST_ROBOTS_FAILED, payload: mockError },
    ]);
  });

  it("does not dispatch REQUEST_ROBOTS_SUCCESS when API call returns an error status", async () => {
    nock(base).get(endpoint).reply(404);

    await store.dispatch(actions.requestRobots());
    const action = store.getActions();
    expect(action).not.toContain({ type: types.REQUEST_ROBOTS_SUCCESS });
  });
});
