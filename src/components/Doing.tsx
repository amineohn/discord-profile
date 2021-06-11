import { forwardRef, useEffect, useMemo, useState } from "react";
import Progress from "../components/Progress";
import { Presence } from "../types/lanyard";
import { motion } from "framer-motion";
// Thanks to Tim (https://github.com/timcole/timcole.me/blob/%F0%9F%A6%84/components/lanyard.tsx) for the types

enum Operation {
  Event,
  Hello,
  Initialize,
  Heartbeat,
}

enum EventType {
  INIT_STATE = "INIT_STATE",
  PRESENCE_UPDATE = "PRESENCE_UPDATE",
}

type SocketEvent = {
  op: Operation;
  t?: EventType;
  d: Presence | unknown;
};

const logLanyardEvent = (eventName: string, data: any) => {
  // eslint-disable-next-line no-console
};

const discordId = "762055588762877973";
const config = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.4,
    },
  },
};
const Doing = (
  { setActive, ...props }: { setActive: (active: boolean) => void } & any,
  ref: any
) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [doing, setDoing] = useState<Presence>();

  const send = (op: Operation, d?: unknown): void => {
    if (socket !== null) socket.send(JSON.stringify({ op, d }));
  };

  useEffect(() => {
    if (socket === null) return () => {};

    socket.onmessage = function ({ data }: MessageEvent): void {
      const { op, t, d }: SocketEvent = JSON.parse(data);

      if (op === Operation.Hello) {
        setInterval(
          () => send(Operation.Heartbeat),
          (d as { heartbeat_interval: number }).heartbeat_interval
        );
        send(Operation.Initialize, { subscribe_to_id: discordId });
      } else if (op === Operation.Event && t) {
        logLanyardEvent(t, d);

        if ([EventType.INIT_STATE, EventType.PRESENCE_UPDATE].includes(t))
          setDoing(d as Presence);
      }
    };

    socket.onclose = () => {
      setSocket(null);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) setSocket(new WebSocket("wss://api.lanyard.rest/socket"));
  }, [socket]);

  const currentActivity = useMemo(
    () => doing?.activities.filter((activity) => activity.type === 0)[0],
    [doing]
  );

  useEffect(() => {
    setActive(doing?.listening_to_spotify || currentActivity);
  }, [doing, currentActivity]);

  if (!doing || !doing?.discord_status) return null;
  const currentDate: any = new Date();

  const timeElapsed = (startTime: any) => {
    const formatIntDouble = (int: number) => {
      return int < 10 && int >= 0 ? "0" + int : int;
    };

    var endTime: any = currentDate;
    var timeDiff = endTime - startTime;
    timeDiff /= 1000;
    var seconds = Math.round(timeDiff % 60);
    timeDiff = Math.floor(timeDiff / 60);
    var minutes = Math.round(timeDiff % 60);
    timeDiff = Math.floor(timeDiff / 60);
    var hours = Math.round(timeDiff % 24);
    timeDiff = Math.floor(timeDiff / 24);
    var days = timeDiff;

    return `${days > 0 ? formatIntDouble(days) + ":" : ""}${
      hours > 0 ? formatIntDouble(hours) + ":" : ""
    }${formatIntDouble(minutes) + ":" + formatIntDouble(seconds)}`;
  };
  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={config}>
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="flex">
            {doing?.discord_status === "online" ? (
              <>
                <div className="flex space-x-1">
                  <div className="inline-block w-5 h-5 bg-red-500 rounded-full" />
                  <p className="space-x-1 text-sm text-gray-50">Offline</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex space-x-1">
                  <div className="inline-block w-5 h-5 bg-orange-400 rounded-full" />
                  <p className="space-y-1 text-sm text-gray-50">AFK</p>
                </div>
              </>
            )}
          </div>
          {doing?.listening_to_spotify ? (
            <div className="p-4 pb-6 space-y-6 rounded-md bg-spotify-50 w-96">
              <div className="flex items-center space-x-3.5 sm:space-x-5 lg:space-x-3.5 xl:space-x-5">
                {doing?.listening_to_spotify ? (
                  <>
                    <img
                      src={doing.spotify.album_art_url}
                      className="flex-none w-20 h-20 rounded-md"
                    />
                  </>
                ) : null}
                <div className="min-w-0 flex-auto space-y-0.5">
                  <p className="font-sans font-medium text-white sm:text-base lg:text-sm xl:text-base">
                    Listening to Spotify
                    <div className="inline-block w-2 h-2 ml-2 mb-0.5 rounded-full bg-black animate-ping" />
                  </p>
                  <h2 className="text-sm font-normal truncate text-gray-50 dark:text-white">
                    <motion.h5
                      initial="hidden"
                      animate="visible"
                      variants={config}
                    >
                      {doing.spotify.song}
                    </motion.h5>
                    <motion.p
                      initial="hidden"
                      animate="visible"
                      variants={config}
                    >
                      by {doing.spotify.artist}
                    </motion.p>
                  </h2>
                </div>
              </div>
            </div>
          ) : null}
          {currentActivity ? (
            <>
              <div className="p-4 pb-6 space-x-2 space-y-6 bg-true-gray-900 rounded-md mt-2.5 w-96">
                <div className="flex items-center space-x-3.5 sm:space-x-5 lg:space-x-3.5 xl:space-x-5">
                  {currentActivity.assets ? (
                    <>
                      <div className="flex">
                        <img
                          src={`https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.large_image}.png`}
                          className="flex-none w-20 h-20 rounded-md"
                        />
                      </div>
                      <div className="inline-block nailed">
                        <img
                          src={`https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.small_image}.png`}
                          className="w-6 h-6 rounded-full"
                        />
                      </div>
                    </>
                  ) : null}
                  <div className="min-w-0 flex-auto space-y-0.5">
                    <p className="text-sm font-medium text-white sm:text-base lg:text-sm xl:text-base">
                      {currentActivity.name}
                    </p>
                    <motion.h2
                      initial="hidden"
                      animate="visible"
                      variants={config}
                      className="text-sm font-normal truncate text-gray-50 dark:text-white"
                    >
                      {currentActivity.details ? (
                        <p>{currentActivity.details}</p>
                      ) : null}
                      {currentActivity.state ? (
                        <p>{currentActivity.state}</p>
                      ) : null}
                    </motion.h2>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </motion.div>
    </>
  );
};
export default forwardRef(Doing);
