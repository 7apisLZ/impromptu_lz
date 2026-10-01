// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import type { JoinResult } from "@impromptu/api/contracts";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { CSSProperties, ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

<<<<<<< HEAD
const {
  disconnectRoom,
  joinRoom,
  leaveRoom,
  mockParticipants,
  sendChat,
  setAttributes,
  setName,
} = vi.hoisted(() => ({
  disconnectRoom: vi.fn<() => Promise<void>>(),
  joinRoom: vi.fn<(topicId: string, input: unknown) => Promise<unknown>>(),
  leaveRoom:
    vi.fn<(topicId: string, participantIdentity: string) => Promise<unknown>>(),
  mockParticipants: {
    current: [
      {
        attributes: { "debate.vote": "0" },
        identity: "spectator-id",
        joinedAt: new Date(100),
        name: "Test spectator",
        permissions: { canPublish: false },
      },
      {
        attributes: { "debate.side": "0" },
        identity: "debater-id",
        joinedAt: new Date(200),
        name: "Debater guest",
        permissions: { canPublish: true },
      },
    ] as Array<{
      attributes: Record<string, string>;
      identity: string;
      joinedAt: Date;
      name: string;
      permissions: { canPublish: boolean };
    }>,
  },
  sendChat: vi.fn<(message: string) => Promise<unknown>>(),
  setAttributes: vi.fn<(attributes: Record<string, string>) => Promise<void>>(),
  setName: vi.fn<(name: string) => Promise<void>>(),
}));
=======
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const { disconnectRoom, leaveRoom, sendChat, setAttributes, setName } =
  vi.hoisted(() => ({
    disconnectRoom: vi.fn<() => Promise<void>>(),
    leaveRoom:
      vi.fn<
        (topicId: string, participantIdentity: string) => Promise<unknown>
      >(),
    sendChat: vi.fn<(message: string) => Promise<unknown>>(),
    setAttributes:
      vi.fn<(attributes: Record<string, string>) => Promise<void>>(),
    setName: vi.fn<(name: string) => Promise<void>>(),
  }));
>>>>>>> parent of 9d1b2bc (features: spectator list in lobby, refresh makes user remain in lobby, spectators must have display names)

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mockParticipants.current = [
    {
      attributes: { "debate.vote": "0" },
      identity: "spectator-id",
      joinedAt: new Date(100),
      name: "Test spectator",
      permissions: { canPublish: false },
    },
    {
      attributes: { "debate.side": "0" },
      identity: "debater-id",
      joinedAt: new Date(200),
      name: "Debater guest",
      permissions: { canPublish: true },
    },
  ];
});

vi.mock("../api", () => ({
  joinTopic: vi.fn<() => never>(),
  leaveTopic: leaveRoom,
}));

vi.mock("@livekit/components-react", () => ({
  LiveKitRoom: ({
    audio,
    children,
    connect,
    onMediaDeviceFailure,
    video,
  }: {
    audio: boolean;
    children: ReactNode;
    connect: boolean;
    onMediaDeviceFailure?: () => void;
    video: boolean | { resolution: { height: number; width: number } };
  }) => (
    <div
      data-testid="livekit-room"
      data-audio={audio}
      data-connect={connect}
      data-video={Boolean(video)}
      data-video-height={
        typeof video === "object" ? video.resolution.height : undefined
      }
      data-video-width={
        typeof video === "object" ? video.resolution.width : undefined
      }
    >
      {children}
      <button type="button" onClick={onMediaDeviceFailure}>
        Simulate media failure
      </button>
    </div>
  ),
  RoomAudioRenderer: () => null,
  VideoTrack: ({ style }: { style?: CSSProperties }) => (
    <div data-testid="video-track" style={style} />
  ),
  useChat: () => ({
    chatMessages: [
      {
        from: { identity: "another-id", name: "Another guest" },
        id: "message-1",
        message: "Hello room",
        timestamp: 1,
      },
    ],
    isSending: false,
    send: sendChat,
  }),
<<<<<<< HEAD
  useParticipants: () => mockParticipants.current,
=======
  useParticipants: () => [
    {
      attributes: { "debate.vote": "0" },
      identity: "spectator-id",
      name: "Test spectator",
      permissions: { canPublish: false },
    },
    {
      attributes: { "debate.side": "0" },
      identity: "debater-id",
      name: "Debater guest",
      permissions: { canPublish: true },
    },
  ],
>>>>>>> parent of 9d1b2bc (features: spectator list in lobby, refresh makes user remain in lobby, spectators must have display names)
  useRoomContext: () => ({
    disconnect: disconnectRoom,
    localParticipant: {
      attributes: { "debate.vote": "0" },
      setAttributes,
      setName,
    },
  }),
  useTracks: () => [
    {
      participant: { identity: "debater-id" },
    },
  ],
}));

import { DebateExperience } from "./debate";

describe("DebateExperience", () => {
  it("connects spectators without publishing media and lets them vote and chat", async () => {
    sendChat.mockResolvedValue({});
    setAttributes.mockResolvedValue();
    setName.mockResolvedValue();
    const join: JoinResult = {
      topicId: "dream-cheating",
      topicTitle: "Can you cheat in a dream?",
      sides: ["Yes: intention still matters", "No: dreams are involuntary"],
      participantIdentity: "7ffcd8af-4d5a-45d9-97cc-6db63b930b09",
      displayName: "Test spectator",
      role: "spectator",
      sideIndex: null,
      livekitUrl: "ws://localhost:7880",
      token: "spectator-token",
    };

    render(
      <MemoryRouter>
        <DebateExperience initialLobbyState="VOTING" join={join} />
      </MemoryRouter>,
    );

    const room = screen.getByTestId("livekit-room");
    expect(screen.queryByText("Spectator", { exact: true })).toBeNull();
    expect(room).toHaveAttribute("data-audio", "false");
    expect(room).toHaveAttribute("data-video", "false");
    expect(screen.queryByText("Open position")).not.toBeInTheDocument();
    expect(screen.getByText("Debater guest")).toHaveClass("bg-emerald-50/80");
    expect(screen.getByTestId("video-track")).toHaveStyle({
      transform: "scaleX(-1)",
    });
    const firstSide = screen
      .getByRole("heading", { name: "Yes: intention still matters" })
      .closest("article");
    expect(firstSide).not.toBeNull();
    expect(within(firstSide!).getByTestId("video-track")).toBeVisible();
    expect(screen.getByText(/Hello room/)).toBeVisible();
    const messageTime = document.querySelector("time");
    expect(messageTime).toHaveAttribute("datetime", new Date(1).toISOString());
    expect(messageTime).toHaveTextContent(
      new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(1)),
    );
    const sidesFilled = screen.getByText("Sides filled").closest("div");
    const spectators = screen.getByText("Spectators").closest("div");
    expect(sidesFilled).not.toBeNull();
    expect(spectators).not.toBeNull();
    expect(within(sidesFilled!).getByText("1 of 2")).toBeVisible();
    expect(within(spectators!).getByText("1")).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: /Yes: intention still matters.*1/,
      }),
    ).toBePressed();
    expect(
      screen.getByRole("button", {
        name: /Yes: intention still matters.*1/,
      }),
    ).toHaveStyle({ flexGrow: "2" });
    expect(
      screen.getByRole("button", { name: /No: dreams are involuntary.*0/ }),
    ).toHaveStyle({ flexGrow: "1" });

    fireEvent.click(
      screen.getByRole("button", {
        name: /Yes: intention still matters.*1/,
      }),
    );
    await waitFor(() =>
      expect(setAttributes).toHaveBeenCalledWith({ "debate.vote": "" }),
    );
    setAttributes.mockClear();

    fireEvent.click(
      screen.getByRole("button", { name: /No: dreams are involuntary.*0/ }),
    );
    await waitFor(() =>
      expect(setAttributes).toHaveBeenCalledWith({ "debate.vote": "1" }),
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Display name" }), {
      target: { value: "Chat guest" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(setName).toHaveBeenCalledWith("Chat guest"));

    fireEvent.change(screen.getByRole("textbox", { name: "Message" }), {
      target: { value: "  Hello back  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => expect(sendChat).toHaveBeenCalledWith("Hello back"));
  });

  it("does not let a debater vote or send chat messages", () => {
    const join: JoinResult = {
      topicId: "dream-cheating",
      topicTitle: "Can you cheat in a dream?",
      sides: ["Yes: intention still matters", "No: dreams are involuntary"],
      participantIdentity: "7ffcd8af-4d5a-45d9-97cc-6db63b930b09",
      displayName: "Test debater",
      role: "debater",
      sideIndex: 0,
      livekitUrl: "ws://localhost:7880",
      token: "debater-token",
    };

    render(
      <MemoryRouter>
        <DebateExperience initialLobbyState="VOTING" join={join} />
      </MemoryRouter>,
    );

    const room = screen.getByTestId("livekit-room");
    expect(room).toHaveAttribute("data-video", "true");
    expect(room).toHaveAttribute("data-video-width", "1280");
    expect(room).toHaveAttribute("data-video-height", "720");
    expect(screen.queryByText("Debater", { exact: true })).toBeNull();
    const readOnlyVote = screen.getByTitle("Only spectators can vote.");
    expect(readOnlyVote).toBeVisible();
    expect(
      screen.getByText(
        "Audience votes appear here as spectators choose the stronger argument.",
      ),
    ).toBeVisible();
    expect(screen.getByText("1 spectator vote")).toBeVisible();
    expect(
      within(readOnlyVote)
        .getByText("Yes: intention still matters")
        .closest("div"),
    ).toHaveStyle({ flexGrow: "2" });
    expect(
      screen.queryByRole("button", { name: /Yes: intention still matters/ }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Audience chat")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Send message" })).toBeNull();
    expect(setAttributes).not.toHaveBeenCalled();
    expect(sendChat).not.toHaveBeenCalled();
  });

  it("defaults initial lobby state to 'WAITING'", () => {
    const join: JoinResult = {
      topicId: "dream-cheating",
      topicTitle: "Can you cheat in a dream?",
      sides: ["Yes: intention still matters", "No: dreams are involuntary"],
      participantIdentity: "7ffcd8af-4d5a-45d9-97cc-6db63b930b09",
      displayName: "Test spectator",
      role: "spectator",
      sideIndex: null,
      livekitUrl: "ws://localhost:7880",
      token: "spectator-token",
    };

    render(
      <MemoryRouter>
        <DebateExperience join={join} />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Audience vote")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Begin Debate" }),
    ).not.toBeInTheDocument();
  });

  it("hides audience voting and hides Begin Debate button in 'WAITING' when not meeting 2 debaters and 1 spectator", () => {
    const join: JoinResult = {
      topicId: "dream-cheating",
      topicTitle: "Can you cheat in a dream?",
      sides: ["Yes: intention still matters", "No: dreams are involuntary"],
      participantIdentity: "7ffcd8af-4d5a-45d9-97cc-6db63b930b09",
      displayName: "Test spectator",
      role: "spectator",
      sideIndex: null,
      livekitUrl: "ws://localhost:7880",
      token: "spectator-token",
    };

    render(
      <MemoryRouter>
        <DebateExperience initialLobbyState="WAITING" join={join} />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Audience vote")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Begin Debate" }),
    ).not.toBeInTheDocument();
  });

  it("displays Begin Debate button to everyone in 'WAITING' when there are 2 debaters and 1 spectator", () => {
    mockParticipants.current = [
      {
        attributes: {},
        identity: "spectator-1",
        joinedAt: new Date(100),
        name: "Spectator 1",
        permissions: { canPublish: false },
      },
      {
        attributes: { "debate.side": "0" },
        identity: "debater-1",
        joinedAt: new Date(200),
        name: "Debater 1",
        permissions: { canPublish: true },
      },
      {
        attributes: { "debate.side": "1" },
        identity: "debater-2",
        joinedAt: new Date(300),
        name: "Debater 2",
        permissions: { canPublish: true },
      },
    ];

    const spectatorJoin: JoinResult = {
      topicId: "dream-cheating",
      topicTitle: "Can you cheat in a dream?",
      sides: ["Yes: intention still matters", "No: dreams are involuntary"],
      participantIdentity: "spectator-1",
      displayName: "Spectator 1",
      role: "spectator",
      sideIndex: null,
      livekitUrl: "ws://localhost:7880",
      token: "spectator-token",
    };

    const { unmount } = render(
      <MemoryRouter>
        <DebateExperience initialLobbyState="WAITING" join={spectatorJoin} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Begin Debate" })).toBeVisible();
    expect(screen.queryByText("Audience vote")).not.toBeInTheDocument();

    unmount();

    const debaterJoin: JoinResult = {
      topicId: "dream-cheating",
      topicTitle: "Can you cheat in a dream?",
      sides: ["Yes: intention still matters", "No: dreams are involuntary"],
      participantIdentity: "debater-1",
      displayName: "Debater 1",
      role: "debater",
      sideIndex: 0,
      livekitUrl: "ws://localhost:7880",
      token: "debater-token",
    };

    render(
      <MemoryRouter>
        <DebateExperience initialLobbyState="WAITING" join={debaterJoin} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Begin Debate" })).toBeVisible();
    expect(screen.queryByText("Audience vote")).not.toBeInTheDocument();
  });

  it("hides audience voting and Begin Debate button in 'IN PROGRESS'", () => {
    mockParticipants.current = [
      {
        attributes: {},
        identity: "spectator-1",
        joinedAt: new Date(100),
        name: "Spectator 1",
        permissions: { canPublish: false },
      },
      {
        attributes: { "debate.side": "0" },
        identity: "debater-1",
        joinedAt: new Date(200),
        name: "Debater 1",
        permissions: { canPublish: true },
      },
      {
        attributes: { "debate.side": "1" },
        identity: "debater-2",
        joinedAt: new Date(300),
        name: "Debater 2",
        permissions: { canPublish: true },
      },
    ];

    const join: JoinResult = {
      topicId: "dream-cheating",
      topicTitle: "Can you cheat in a dream?",
      sides: ["Yes: intention still matters", "No: dreams are involuntary"],
      participantIdentity: "spectator-1",
      displayName: "Spectator 1",
      role: "spectator",
      sideIndex: null,
      livekitUrl: "ws://localhost:7880",
      token: "spectator-token",
    };

    render(
      <MemoryRouter>
        <DebateExperience initialLobbyState="IN PROGRESS" join={join} />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Audience vote")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Begin Debate" }),
    ).not.toBeInTheDocument();
  });

  it("displays audience voting and hides Begin Debate button in 'ENDED'", () => {
    const join: JoinResult = {
      topicId: "dream-cheating",
      topicTitle: "Can you cheat in a dream?",
      sides: ["Yes: intention still matters", "No: dreams are involuntary"],
      participantIdentity: "7ffcd8af-4d5a-45d9-97cc-6db63b930b09",
      displayName: "Test spectator",
      role: "spectator",
      sideIndex: null,
      livekitUrl: "ws://localhost:7880",
      token: "spectator-token",
    };

    render(
      <MemoryRouter>
        <DebateExperience initialLobbyState="ENDED" join={join} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Audience vote")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Begin Debate" }),
    ).not.toBeInTheDocument();
  });

  it("disconnects a debater whose camera or microphone cannot start", async () => {
    disconnectRoom.mockResolvedValue();
    leaveRoom.mockResolvedValue({ left: true });
    const join: JoinResult = {
      topicId: "dream-cheating",
      topicTitle: "Can you cheat in a dream?",
      sides: ["Yes: intention still matters", "No: dreams are involuntary"],
      participantIdentity: "7ffcd8af-4d5a-45d9-97cc-6db63b930b09",
      displayName: "Test debater",
      role: "debater",
      sideIndex: 0,
      livekitUrl: "ws://localhost:7880",
      token: "debater-token",
    };

    render(
      <MemoryRouter>
        <DebateExperience join={join} />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Simulate media failure" }),
    );

    await waitFor(() => expect(disconnectRoom).toHaveBeenCalledOnce());
    expect(leaveRoom).toHaveBeenCalledWith(
      join.topicId,
      join.participantIdentity,
    );
    expect(screen.getByTestId("livekit-room")).toHaveAttribute(
      "data-connect",
      "false",
    );
  });
});
