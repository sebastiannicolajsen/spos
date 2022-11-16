import { useRef, useState } from "react";
import { FaEdit, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { btn } from "../../components/styles";
import api from "../../spos-client";
import { Subscriber } from "../../spos-client/types";

function SubscriberPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const loadedSubscribers = useRef(false);

  const [isEditing, setIsEditng] = useState<boolean>(false);
  const [editing, setEditing] = useState<Subscriber | null>(null);

  const refresh = () => {
    api.subscriber.list().then((subscribers) => {
      setSubscribers(subscribers);
    });
  };

  if (!loadedSubscribers.current) {
    loadedSubscribers.current = true;
    refresh();
  }

  const SubscriberEditor = (sub: Subscriber | null) => {
    const [name, setName] = useState(sub?.id || "");
    const [code, setCode] = useState(sub?.code || "");
    const [events, setEvents] = useState<string[]>(sub?.events || []);
    const [objects, setObjects] = useState<string[]>(sub?.objects || []);

    return (
      <div>
        {sub ? (
          <button className={btn}>
            <FaUpload />
            Update
          </button>
        ) : (
          <button className={btn}>
            <FaPlus />
            Create
          </button>
        )}
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
            <button onClick={() => {}} className={`${btn} mr-3 `}>
              <FaEdit />
            </button>
            <button
              onClick={() => {
                api.subscriber.delete(sub.id).then(() => {
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

  return (
    <div className="grid grid-cols-1  w-4/5 m-auto">
      {isEditing && SubscriberEditor(editing)}
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
