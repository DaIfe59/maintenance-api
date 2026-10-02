import {
  getAllowedTransitions
} from "../../src/services/requestsService.js";

describe("Request status transitions", () => {
  test("new allows in_progress and rejected", () => {
    expect(getAllowedTransitions("new")).toEqual([
      "in_progress",
      "rejected"
    ]);
  });

  test("in_progress allows done and rejected", () => {
    expect(getAllowedTransitions("in_progress")).toEqual([
      "done",
      "rejected"
    ]);
  });

  test("done cannot be changed", () => {
    expect(getAllowedTransitions("done")).toEqual([]);
  });

  test("rejected cannot be changed", () => {
    expect(getAllowedTransitions("rejected")).toEqual([]);
  });
});