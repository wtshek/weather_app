import { act, renderHook } from "@testing-library/react";
import { useCurrentTime } from "../useCurrentTime";

describe("useCurrentTime Test Suite", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return the current time", () => {
    const mockCurrentTime = "2023-07-07 12:11:51";
    jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => new Date(mockCurrentTime).getTime());

    const { result } = renderHook(() => useCurrentTime());

    expect(result.current).toStrictEqual(mockCurrentTime);
    jest.spyOn(global.Date, "now").mockRestore();
  });
  it("should return the current time every 60 seconds", () => {
    const onUpdateMock = jest.fn();
    const { result } = renderHook(() => useCurrentTime(true));

    const initialTime = result.current;

    // Advance time by 60 seconds
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    const updatedTime = result.current;
    expect(initialTime).not.toBe(updatedTime);

    // Advance time by 30 seconds (less than 60 seconds)
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    const sameTime = result.current;
    expect(updatedTime).toBe(sameTime);

    act(() => {
      jest.advanceTimersByTime(60000);
    });
    const newTime = result.current;
    expect(updatedTime).not.toBe(newTime);
  });

  it("should not update the returned time", () => {
    const { result } = renderHook(() => useCurrentTime(false));
    const initialTime = result.current;

    // Advance time by 60 seconds
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    const updatedTime = result.current;
    expect(initialTime).toBe(updatedTime);
  });
});
