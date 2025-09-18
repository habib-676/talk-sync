import React from "react";

const ExtraMeetTheTeam = ({ leaders, members }) => {
  return (
    <div  className="mt-12">
      {/* leaders and manager row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-6 mb-16">
        {leaders.map((member, idx) => (
          <div key={idx} className="w-xs">
            <figure className="relative">
              <img
                src={member.head_shot}
                alt={member.name}
                className="rounded-lg shadow-md w-full"
              />
              {/* Bottom card overlay */}
              <div className="absolute bg-base-100 w-[85%] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4 py-2 rounded-md text-center">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </figure>
          </div>
        ))}
      </div>
      {/* only members row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-12">
        {members.map((member, idx) => (
          <div key={idx} className="">
            <figure className="relative">
              <img
                src={member.head_shot}
                alt={member.name}
                className="rounded-lg shadow-md w-full"
              />
              {/* Bottom card overlay */}
              <div className="absolute bg-base-100 w-[85%] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4 py-2 rounded-md text-center">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtraMeetTheTeam;
