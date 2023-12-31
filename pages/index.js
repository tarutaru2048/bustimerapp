import Head from 'next/head';
import React, {useState, useEffect} from 'react';
import bustimesData from '../bustime.json';
import styles from '../styles/Home.module.css';
import holidayJp from 'japanese-holidays';

const isItWeekend = () => {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

// const WeekendChecker = () => {
//   const [isWeekend, setIsWeekend] = useState(false);

//   useEffect(() => {
//     const updateWeekendStatus = () => {
//       setIsWeekend(isItWeekend());
//     };

//     updateWeekendStatus();

//     const intervalId = setInterval(updateWeekendStatus, 24 * 60 * 60 * 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   return (
//     <div>
//       <h2>
//         <p>今日は {isWeekend ? '休日です' : '平日です'}!</p>
//       </h2>
//     </div>
//   );
// };

const isItHoliday = () => {
  const currentDate = new Date();
  return holidayJp.isHoliday(currentDate);
};

// const HolidayChecker = () => {
//   const [isHoliday, setIsHoliday] = useState(false);

//   useEffect(() => {
//     const updateHolidayStatus = () => {
//       setIsHoliday(isItHoliday());
//     };

//     updateHolidayStatus();

//     const intervalId = setInterval(updateHolidayStatus, 24 * 60 * 60 * 1000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   return (
//     <div>
//       <h2>
//         <p>今日は {isHoliday ? '祝日です' : '祝日ではありません'}!</p>
//       </h2>
//     </div>
//   );
// };

const DiagramChecker = () => {
  const isWeekendorHoliday = (isItWeekend() || isItHoliday());
  return(
  <div>
    <h2>
      <p>{isWeekendorHoliday ? '休日ダイヤ' : '平日ダイヤ'}</p>
    </h2>
  </div>
  );
    
}

const sortBustimes = () => {
  const todaybustime = ((isItWeekend() || isItHoliday())) ? bustimesData.BustimesHoliday : bustimesData.BustimesWeekday;
  const sortedBustimes = todaybustime.sort((a, b) => {
    if (a.hour !== b.hour) {
      return a.hour - b.hour;
    }
    return a.minute - b.minute;
  });

  return sortedBustimes;
};

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(null);
  
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentTime) return null;

  return (
    <div className={styles.centeralign}> 
      <h1>現在の時刻</h1>
      <h1>{currentTime.toLocaleTimeString()}</h1>
    </div>
  );
};

const GetBustime = () => {
  const [nextBuses, setNextBuses] = useState([]);
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const findNextBuses = () => {
      const now = new Date();
      setCurrentTime(now);

      const allBustimes = sortBustimes();
      const upcomingBuses = [];
      for (let bus of allBustimes) {
        if (
          (bus.hour > now.getHours()) ||
          (bus.hour === now.getHours() && bus.minute > now.getMinutes())
        ) {
          upcomingBuses.push(bus);
          if (upcomingBuses.length === 5) {
            break; // 5つ先のバスを取得したらループを抜ける
          }
        }
      }
      setNextBuses(upcomingBuses);
    };

    findNextBuses();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      findNextBuses();
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {nextBuses.length > 0 ? (
        <div>
          <p className={styles.centeralign}><strong>次の5つのバスの情報は：</strong></p>
          {nextBuses.map((bus, index) => (
            <p key={index}
            className={styles.card}>
              {index === 0 ? (
                <h1>
                  時刻: {String(bus.hour).padStart(2, '0')}:{String(bus.minute).padStart(2, '0')}, 行先:{bus.destination}, 系統:{bus.route}
                </h1>
              ) : (
                <span>時刻: {String(bus.hour).padStart(2, '0')}:{String(bus.minute).padStart(2, '0')}, 行先:{bus.destination}, 系統:{bus.route}</span>
              )}
            </p>
          ))}
        </div>
      ) : (
        <div>
          今日のバスの時刻はすべて終了しました。
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>バス時刻掲示板</title>
      </Head>
      <section>
        <h1>はこだて未来大学バス停</h1>
        <Clock />
        <DiagramChecker />
        <GetBustime />
      </section>
    </div>
  )
}