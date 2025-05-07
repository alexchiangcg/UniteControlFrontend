import { useRef, useState } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "../utils/event-utils";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
}

export default function CalendarApp() {
  const calendarRef = useRef<FullCalendar>(null);
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>([]);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  interface SelectInfo {
    view: {
      calendar: {
        unselect: () => void;
        addEvent: (event: {
          id: string;
          title: string;
          start: string;
          end: string;
          allDay: boolean;
        }) => void;
      };
    };
    startStr: string;
    endStr: string;
    allDay: boolean;
  }

  function handleDateSelect(selectInfo: SelectInfo) {
    let title = prompt("請輸入新的event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();
    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  function handleEventClick(clickInfo: any) {
    if (confirm(`你確定要刪除此event嗎？ event名稱：'${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  function handleEvents(events: any) {
    setCurrentEvents(events);
  }

  const handleFakeApiClick = () => {
    const maxGPU = 8;
    const fakeEvents = [
      {
        id: "e1",
        title: "Alex 任務",
        start: "2025-05-07T12:00:00",
        end: "2025-05-12T15:00:00",
        extendedProps: {
          group: "team2",
          gpu: 3,
          width: `${(3 / maxGPU) * 100}%`,
          leftOffset: 0,
        },
      },
      {
        id: "e2",
        title: "Bella 訓練",
        start: "2025-05-08T10:00:00",
        end: "2025-05-10T18:00:00",
        extendedProps: {
          group: "team1",
          gpu: 2,
          width: `${(2 / maxGPU) * 100}%`,
          leftOffset: 37.5,
        },
      },
      {
        id: "e3",
        title: "Charlie 測試",
        start: "2025-05-09T09:00:00",
        end: "2025-05-11T20:00:00",
        extendedProps: {
          group: "team3",
          gpu: 5,
          width: `${(5 / maxGPU) * 100}%`,
          leftOffset: 0,
        },
      },
    ];

    const calendarApi = calendarRef.current?.getApi();
    fakeEvents.forEach((e) => calendarApi?.addEvent(e));
  };

  return (
    <div className="demo-app">
      <Sidebar
        weekendsVisible={weekendsVisible}
        handleWeekendsToggle={handleWeekendsToggle}
        currentEvents={currentEvents}
        handleFakeApiClick={handleFakeApiClick}
      />
      <div className="demo-app-main">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          initialEvents={INITIAL_EVENTS}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
          eventDidMount={(info) => {
            const gpu = info.event.extendedProps.gpu;
            const maxGPU = 8;
            const percent = (gpu / maxGPU) * 100;
            const leftOffset = info.event.extendedProps.leftOffset || 0;
            const group = info.event.extendedProps.group;
          
            const groupColorMap: Record<string, string> = {
              team1: "#1abc9c",
              team2: "#3498db",
              team3: "#e67e22",
            };
          
            const bgColor = groupColorMap[group] || "#95a5a6";
          
            const el = info.el as HTMLElement;
            el.style.width = `${percent}%`;
            el.style.left = `${leftOffset}%`;
            el.style.backgroundColor = bgColor; // ✅ 改掉預設藍色
            el.style.border = "none";           // ✅ 拿掉預設邊框（可選）
            el.style.color = "white";           // ✅ 確保文字顏色對比
          }}
          
        />
      </div>
    </div>
  );
}

function renderEventContent(eventInfo: any) {
  const { gpu, group } = eventInfo.event.extendedProps;

  const groupColorMap: Record<string, string> = {
    team1: "#1abc9c",
    team2: "#3498db",
    team3: "#e67e22",
  };

  const bgColor = groupColorMap[group] || "#95a5a6";

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: "white",
        padding: "2px",
        borderRadius: "4px",
        fontSize: "0.75rem",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <b>{eventInfo.timeText}</b>
      <div>{eventInfo.event.title}</div>
      <small>GPU: {gpu}</small>
    </div>
  );
}

interface SidebarProps {
  readonly weekendsVisible: boolean;
  readonly handleWeekendsToggle: () => void;
  readonly currentEvents: CalendarEvent[];
  readonly handleFakeApiClick: () => void;
}

function Sidebar({
  weekendsVisible,
  handleWeekendsToggle,
  currentEvents,
  handleFakeApiClick,
}: SidebarProps) {
  return (
    <div className="demo-app-sidebar">
      <div className="demo-app-sidebar-section">
        <h2>目前測試的功能</h2>
        <ul>
          <li>1. 點日曆可建立新event</li>
          <li>2. 可以 Drag & drop ，直接拉event大小</li>
          <li>3. 點擊 event 可刪除</li>
        </ul>
      </div>
      <div className="demo-app-sidebar-section">
        <label>
          <input
            type="checkbox"
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}
          />
          切換是否顯示六日
        </label>
        <br />
        <button onClick={handleFakeApiClick}>載入假資料</button>
      </div>
      <div className="demo-app-sidebar-section">
        <h2>event 列表 ({currentEvents.length})</h2>
        <ul>
          {currentEvents.map((event: CalendarEvent, idx) => (
            <SidebarEvent key={event.id || `fallback-${idx}`} event={event} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function SidebarEvent({ event }: { readonly event: CalendarEvent }) {
  return (
    <li>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}
