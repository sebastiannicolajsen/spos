import React, { useRef, useState } from "react";
import {
  FaArrowCircleRight,
  FaCircleNotch,
  FaDownload,
  FaPause,
  FaPlay,
  FaPlus,
  FaQuestion,
  FaQuestionCircle,
  FaRegArrowAltCircleRight,
  FaRegCheckCircle,
  FaRegCheckSquare,
  FaRegQuestionCircle,
  FaTrash,
} from "react-icons/fa";
import { btn, greenLabel, input, redLabel } from "../../components/styles";
import api from "../../spos-client";
import {
  CronJobData,
  Interval,
  toInterval,
  xMinute,
} from "../../spos-client/types";

export class CronPage extends React.Component<{}, { jobs: CronJobData[] }> {
  constructor() {
    super({});
    this.state = { jobs: [] };
  }

  componentDidMount() {
    api.cron.list().then((jobs) => {
      this.setState({ jobs });
    });
  }

  render() {
    const refresh = () => {
      api.cron.list().then((jobs) => {
        this.setState({ jobs });
      });
    };

    const job = (job: CronJobData) => {
      const date = new Date(job.next);
      const timeString = `${date.getHours()}:${
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      }`;

      return (
        <>
          <div className="grid grid-cols-5 gap-1 pb-2 text-left font-mono">
            <div>{job.id}</div>
            <div>
              {job.status ? (
                <div className={greenLabel}>running</div>
              ) : (
                <div className={redLabel}>paused</div>
              )}
            </div>
            <div>{job.event}</div>
            <div>
              {job.status ? (
                <>
                  {timeString} (every {toInterval(job.interval).minutes}m)
                </>
              ) : (
                <>--</>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {job.status && (
                <button
                  onClick={() =>
                    api.cron.pause(job.id).then(() => {
                      refresh();
                    })
                  }
                  className={btn}
                >
                  <FaPause />
                </button>
              )}

              {!job.status && (
                <button
                  onClick={() =>
                    api.cron.restart(job.id).then(() => {
                      refresh();
                    })
                  }
                  className={btn}
                >
                  <FaPlay />
                </button>
              )}

              <button
                onClick={() => {
                  api.cron.delete(job.id).then(() => {
                    refresh();
                  });
                }}
                className={btn}
              >
                <FaTrash />
              </button>
            </div>
          </div>
          <hr className="m-4" />
        </>
      );
    };

    const CreateUser = () => {
      const [id, setId] = useState("");
      const [event, setEvent] = useState("");
      const [interval, setInterval] = useState("");

      const [events, setEvents] = useState<string[]>([]);
      const loadedEvents = useRef(false);

      if (!loadedEvents.current) {
        loadedEvents.current = true;
        api.events.list().then((events) => {
          setEvents(events);
        });
      }

      return (
        <div className="grid grid-cols-4 gap-6">
          <div>
            <input
              className={input}
              type="text"
              placeholder="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2">
            <input
              className={input}
              type="text"
              placeholder="event"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
            />
            {!events.includes(event) ? (
              <div className="ml-2" style={{ display: "flex", alignItems: "center" }}>
                <FaRegQuestionCircle className="text-slate-500"/>
              </div>
            ) : (
                <div className="ml-2" style={{ display: "flex", alignItems: "center" }}>
                <FaRegCheckCircle className="text-blue-500"/>
              </div>
            )}
          </div>
          <div>
            <input
              className={input}
              type="text"
              placeholder="repeat (minutes)"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
            />
          </div>
          <div>
            <button
              disabled={event === "" || id === "" || interval === ""}
              className={btn}
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => {
                api.cron
                  .create(id, event, xMinute(parseInt(interval)))
                  .then(() => {
                    api.cron.list().then((jobs) => {
                      this.setState({ jobs });
                    });
                  });
                setId("");
                setEvent("");
              }}
            >
              <FaPlus className="pr-2" /> Create cron job
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="grid grid-cols-1 m-auto">
        <CreateUser />
        <hr className="m-4" />
        <div className="grid grid-cols-1 content-center">
          <div className="grid grid-cols-5 text-slate-500 font-semibold pb-5 text-left">
            <div>name</div>
            <div>status</div>
            <div>event</div>
            <div>Execution time</div>
            <div></div>
          </div>
        </div>

        <div className="grid grid-cols-1 content-center">
          {this.state.jobs.map(job)}
        </div>
      </div>
    );
  }
}

export default CronPage;
