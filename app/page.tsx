import ServerErrorDialog from "@/components/dialogs/ErrorDialog";
import UserEditDialog from "@/components/dialogs/UserEditDialog";
import FundChart from "@/components/FundChart";
import StartupCard from "@/components/StartupCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { CALENDAR, CALENDAR_ID, CalendarEvent, convertDate, MemberProfile } from "@/utils/utils";
import Link from "next/link";

const NUM_RECENT_STARTUPS = 4;
const NUM_UPCOMING_EVENTS = 3;
const FUND_UPDATE_DATE = "2025-05-20";

export default async function Home() {
  const client = await createClient();
  const { user: user } = (await client.auth.getUser()).data;

  let initialState = false;
  let errorState = false;

  const { data }: { data: MemberProfile[] | null } = await client
                .schema('members')
                .from('profiles')
                .select('*')
                .eq('email', user?.email);

  if (!data?.length || data?.length === 0) {
    errorState = true;
  } else if (!data[0].completed) {
    initialState = true;
  }

  const { data: startups } = await client
                              .schema('dealflow')
                              .from('startups')
                              .select('*')
                              .order('date_sourced', { ascending: false })
                              .limit(NUM_RECENT_STARTUPS);

  const fetchEvents = async () => {
    const now = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${process.env.GOOGLE_CLOUD_KEY}&singleEvents=true&orderBy=startTime&timeMin=${now}&maxResults=${NUM_UPCOMING_EVENTS}`;

    const res = await fetch(url);
    const data = await res.json();

    return data.items as CalendarEvent[];
  };

  const calendarEvents = await fetchEvents();

  return (
    <main className="w-full">
        <div className="flex pt-12 sm:pl-16 flex-col sm:flex-row text-5xl font-semibold items-center sm:justify-start">
          <h1>Welcome,&nbsp;</h1>
          <h1 className="text-secondary"> {user?.user_metadata.name}</h1>
        </div>
        <div className="w-full flex items-center justify-center mt-10 space-y-5 lg:space-x-5 px-10 lg:flex-row flex-col">
          <Card className="w-2/3 lg:w-1/3">
            <CardHeader className="pb-2">
              <CardTitle className="flex sm:items-center justify-between flex-col sm:flex-row">
                <span className="font-bold text-xl">Fund</span>
                <span className="text-sm opacity-75">Last updated: {convertDate(FUND_UPDATE_DATE)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <FundChart />

            </CardContent>
          </Card>
          <Card className="w-2/3 lg:w-1/3">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span className="font-bold text-xl">Upcoming Events</span>
                  <Link href={CALENDAR} className="text-sm text-gray-500 hover:underline">
                    View all
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  {
                    calendarEvents && calendarEvents.length === 0 &&
                    <span className="opacity-50">There are no upcoming events.</span>
                  }
                  {calendarEvents && calendarEvents.map((event, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center">
                        <h2 className="text-base font-medium text-gray-800 truncate">{event.summary}</h2>
                        <span className="text-sm text-gray-500 shrink-0">
                          {convertDate(event.created)}
                        </span>
                      </div>
                      {event.location && (
                        <p className="text-sm text-gray-600 mt-1 truncate">{event.location}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
          </Card>
          <Card className="w-2/3 lg:w-1/3">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between">
                <span className="font-bold text-xl">Recent Startups</span>
                <Link href={'/startups'} className="opacity-75 text-sm">
                  View all
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 flex flex-col">
                {
                  startups?.map((startup, i) => {
                    return <StartupCard 
                              key={i}
                              startup={startup}
                            />
                  })
                }
              </div>
            </CardContent>
          </Card>
        </div>

        <UserEditDialog 
          user={user} 
          dialogOpen={initialState} 
          member_data={data?.[0]} 
          mode="firstlogin"
          key={"First Login Dialog Prompt"}
        />
        <ServerErrorDialog 
          open={errorState} 
          description="It seems that you weren't added to our members database. Please contact one of our admins or board members to resolve this issue."
        />
    </main>
  );
}
