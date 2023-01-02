import { useEffect, useRef, useState } from "react";
import {
  FaBan,
  FaCross,
  FaEdit,
  FaMarker,
  FaPlay,
  FaPlus,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { btn, input } from "../../components/styles";
import api from "../../spos-client";
import Select from "react-select";
import { Subscriber } from "../../spos-client/types";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import toast, { Toaster } from "react-hot-toast";

function SubscriberPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const loadedSubscribers = useRef(false);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editing, setEditing] = useState<Subscriber>({} as Subscriber);

  const refresh = () => {
    api.subscriber.list().then((subscribers) => {
      setSubscribers(subscribers);
    });
  };

  if (!loadedSubscribers.current) {
    loadedSubscribers.current = true;
    refresh();
  }

  const handleEdit = (subscriber: Subscriber) => {
    setEditing(subscriber);
    setIsEditing(true);
  };

  const disableEdit = () => {
    setIsEditing(false);
  };

  const defCode = "(products) => (\n// your code here\n)";

  const [name, setName] = useState("");
  const [code, setCode] = useState(defCode);
  const [events, setEvents] = useState<string[]>([]);
  const [objects, setObjects] = useState<string[]>(["*"]);

  useEffect(() => {
    setName(isEditing ? editing.id : "");
    setCode(isEditing ? editing.code : defCode);
    setEvents(isEditing ? editing.events : []);
    setObjects(isEditing ? editing.objects : ["*"]);
  }, [isEditing]);

  const stringifyList = (list: any) => {
    return list.map((e: any) => `${e}`).join(" ");
  };

  const toObj = (set: any, list: any) => {
    set(list.split(" ").map((e: any) => e.trim()));
  };

  const SubscriberCreator = () => {
    return (
      <div>
        <button
          style={{ display: "flex", alignItems: "left" }}
          className={btn}
          onClick={() => {
            api.subscriber.create(name, events, objects, code).then(() => {
              refresh();
            });
          }}
        >
          <span className="pr-1 pt-1">
            <FaPlus />
          </span>
          Create
        </button>
      </div>
    );
  };

  const SubscriberEditor = () => {
    return (
      <div className="flex left">
        <button
          onClick={() => {
            console.log(events);
            api.subscriber.update(name, events, objects, code).then(() => {
              refresh();
            });
          }}
          style={{ display: "flex", alignItems: "center" }}
          className={btn}
        >
          <FaUpload />
          Update
        </button>
        <button
          style={{ display: "flex", alignItems: "center" }}
          className={btn}
          onClick={() => disableEdit()}
        >
          Cancel
        </button>
      </div>
    );
  };

  const SubscriberCard = (sub: Subscriber) => {
    return (
      <>
        <div className="grid grid-cols-3 gap-1 pb-2 text-left font-mono">
          <div>{sub.id}</div>
          <div>{sub.events.map((e) => `${e} `)}</div>
          <div>
            <button
              style={{ opacity: isEditing ? 0.5 : 1 }}
              disabled={isEditing}
              onClick={() => {
                handleEdit(sub);
              }}
              className={`${btn} mr-3 `}
            >
              <FaEdit />
            </button>
            <button
              onClick={() => {
                api.subscriber.delete(sub.id).then(() => {
                  refresh();
                });
              }}
              className={`${btn} mr-3 `}
            >
              <FaTrash />
            </button>
            <button
              className={btn}
              onClick={() =>
                api.subscriber.trigger(sub.id).then(() => refresh())
              }
            >
              <FaPlay />
            </button>
          </div>
        </div>
        <hr className="m-4" />
      </>
    );
  };

  return (
    <div className="grid grid-cols-1  w-4/5 m-auto">
      <div className="grid grid-cols-1">
        <div>
          <div className="grid grid-cols-2 pb-5">
            <div>name</div>
            <input
              disabled={isEditing}
              className={input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className=" pb-5">
            <div>code</div>
            <div className=" border grid grid-cols-1">
              <Editor
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) =>
                  highlight(code, languages.javascript, "javascript")
                }
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 15,
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 pb-5">
            <div>
              events <span className="text-slate-400">(space separated)</span>
            </div>
            <input
              className={input}
              value={stringifyList(events)}
              onChange={(e) => toObj(setEvents, e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 pb-5">
            <div>
              objects <span className="text-slate-400">(space separated)</span>
            </div>
            <input
              className={input}
              value={stringifyList(objects)}
              onChange={(e) => toObj(setObjects, e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <button
            onClick={() => {
              api.subscriber
                .validate("asdasdasdas", events, objects, code)
                .then((res) => {
                  if (res.success) {
                    toast.success("Subscriber is valid");
                  } else {
                    toast.error(res.message);
                  }
                });
            }}
            className={btn}
          >
            check
          </button>
        </div>
        {isEditing ? SubscriberEditor() : SubscriberCreator()}
      </div>
      <hr className="m-4" />
      <div className="grid grid-cols-1 content-center">
        <div className="grid grid-cols-3 text-slate-500 font-semibold pb-5 text-left">
          <div>id</div>
          <div>events</div>
          <div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 content-center">
        {subscribers.map(SubscriberCard)}
      </div>
    </div>
  );
}

export default SubscriberPage;
