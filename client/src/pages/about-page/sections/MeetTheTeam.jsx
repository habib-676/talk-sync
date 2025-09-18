import React, { use } from "react";
import ExtraMeetTheTeam from "./ExtraMeetTheTeam";
const teamPromise = fetch("/teamMembersData.json").then((res) => res.json());
const MeetTheTeam = () => {
  const teamData = use(teamPromise);

  //separate team leader and members
  const leaders = teamData.filter(
    (member) =>
      member.role.toLowerCase().includes("manager") ||
      member.role.toLowerCase().includes("leader")
  );
  const members = teamData.filter(
    (member) =>
      !member.role.toLowerCase().includes("manager") &&
      !member.role.toLowerCase().includes("leader")
  );

  console.log(members);

  console.log(leaders);
  return (
    <section className="bg-base py-16 lg:py-24">
      <div className="px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet the Team</h2>
        <p className="text-lg mb-12">
          The passionate people building TalkSync.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamData.map((member, idx) => (
            <div key={idx}>
              <figure className="relative">
                <img
                  src={member.head_shot}
                  alt={member.name}
                  className="rounded-lg shadow-md w-full h-[400px] object-cover object-center"
                />
                {/* Bottom card overlay */}
                <div className="absolute bg-base-100 w-[85%] bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-md text-center">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* <ExtraMeetTheTeam leaders={leaders} members={members} /> */}
    </section>
  );
};

export default MeetTheTeam;
