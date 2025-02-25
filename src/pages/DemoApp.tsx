import { useState } from "react";
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

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>([]);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }


  interface SelectInfo {
    view: {
      calendar: {
        unselect: () => void;
        addEvent: (event: { id: string; title: string; start: string; end: string; allDay: boolean }) => void;
      };
    };
    startStr: string;
    endStr: string;
    allDay: boolean;
  }

  // 建立 event
  function handleDateSelect(selectInfo: SelectInfo) {
    let title = prompt("請輸入新的event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

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

  // 刪除 event
  function handleEventClick(clickInfo: any) {
    if (
      confirm(
        `你確定要刪除此event嗎？ event名稱：'${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  function handleEvents(events: any) {
    setCurrentEvents(events);
  }

  return (
    <div className="demo-app">
      <Sidebar
        weekendsVisible={weekendsVisible}
        handleWeekendsToggle={handleWeekendsToggle}
        currentEvents={currentEvents}
      />
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
          */
        />
      </div>
    </div>
  );
}

// 隨機測試資料
function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

interface SidebarProps {
  readonly weekendsVisible: boolean;
  readonly handleWeekendsToggle: () => void;
  readonly currentEvents: CalendarEvent[];
}

function Sidebar({
  weekendsVisible,
  handleWeekendsToggle,
  currentEvents,
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
      </div>
      <div className="demo-app-sidebar-section">
        <h2>event 列表 ({currentEvents.length})</h2>
        <ul>
          {currentEvents.map((event:CalendarEvent) => (
            <SidebarEvent key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </div>
  );
}



function SidebarEvent({ event }: { readonly event: CalendarEvent }) {
  return (
    <li key={event.id}>
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
