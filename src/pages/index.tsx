import { forwardRef, useEffect, useMemo, useState } from "react";
import Bravery from "../components/icons/Bravery";
import Nitro from "../components/icons/Nitro";
import Github from "../components/icons/Github";
import Twitter from "../components/icons/Twitter";
import Twitch from "../components/icons/Twitch";
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
const Home = (
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

  if (!doing || !doing?.discord_status) return null;
  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={config}>
        <div className="flex items-center">
          <div className="container px-2 py-4 mx-auto my-auto text-white mobile:w-full md:w-full lg:w-7/12 xl:w-">
            <div className="my-40">
              <div className="container relative flex flex-col">
                <div className="absolute ml-6 profile-image">
                  <div className="flex z-1"></div>
                  <img
                    draggable="false"
                    src={`https://cdn.discordapp.com/avatars/${discordId}/${doing?.discord_user.avatar}?size=2048`}
                    className="mt-20 rounded-full shadow-md w-28"
                  />

                  {doing?.discord_status === "online" ? (
                    <>
                      <div className="flex space-x-1">
                        <div className="inline-block w-5 h-5 bg-red-500 rounded-full" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex ml-20 -mt-5 space-x-1">
                        <div className="inline-block w-5 h-5 bg-orange-400 rounded-full" />
                      </div>
                    </>
                  )}
                </div>
                <div className="w-full h-full bg-gray-800 rounded-t-lg banner"></div>
                <div className="pt-16 bg-gray-900 rounded-b-lg">
                  <div className="px-6">
                    <div className="flex flex-wrap pb-4 -mx-2 overflow-hidden">
                      <div className="w-full px-2 overflow-hidden sm:w-1/2">
                        <div className="flex flex-col">
                          <div className="flex flex-row break-all">
                            <a
                              href={`https://discord.com/users/${discordId}`}
                              className="mr-1 break-letters focus:outline-none"
                            >
                              <span className="text-2xl font-bold text-white">
                                {doing?.discord_user.username}
                              </span>
                              <span className="text-lg font-medium text-gray-400">
                                #{doing?.discord_user.discriminator}
                              </span>
                            </a>
                            <span className="inline-flex items-center mt-1">
                              <span className="px-1 badge">
                                <span className="text-lg text-blue-500 fill-current BaseIcon fad fa-badge-check"></span>
                              </span>
                            </span>
                          </div>
                          <div className="flex flex-row items-center h-3 pb-1 mt-2 mb-1 ">
                            <span className="px-1 badge">
                              <Bravery />
                            </span>
                            <span className="px-1 badge">
                              <Nitro />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <div className="mt-4 text-left text-white">
                        <div className="flex flex-col flex-wrap overflow-hidden">
                          <div className="w-1/2 my-2 overflow-hidden lg:w-1/3">
                            <div className="flex w-48 h-10">
                              <div className="flex space-x-1 space-y-1">
                                <span className="space-x-1 fill-current">
                                  <span className="mr-2">
                                    <Github />
                                  </span>
                                </span>
                                <a
                                  href="https://github.com/imveny"
                                  target="_blank"
                                >
                                  <span className="items-center pt-3 space-y-1 font-normal text-md">
                                    Github
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="w-1/2 my-2 overflow-hidden lg:w-1/3">
                            <div className="flex w-48 h-10">
                              <div className="flex space-x-1 space-y-1">
                                <span className="space-x-1 fill-current">
                                  <span className="mr-2">
                                    <Twitter />
                                  </span>
                                </span>
                                <a
                                  href="https://twitter.com/fuckthisimoutd"
                                  target="_blank"
                                >
                                  <span className="items-center pt-3 space-y-1 font-normal text-md">
                                    Twitter
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="w-1/2 my-2 overflow-hidden lg:w-1/3">
                            <div className="flex w-48 h-10">
                              <div className="flex space-x-2">
                                <span className="pt-1 mb-1 space-x-2 fill-current">
                                  <span className="mr-2">
                                    <Twitch />
                                  </span>
                                </span>
                                <a
                                  href="https://www.twitch.tv/isveny"
                                  target="_blank"
                                >
                                  <span className="items-center space-x-1 font-normal text-md">
                                    lefakeveny
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default forwardRef(Home);
