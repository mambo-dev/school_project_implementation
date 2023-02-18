import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Accepted_bids, Bidding, Client, Project, Role } from "@prisma/client";
import { format } from "date-fns";
import React from "react";
import { addCommas } from "../../../src/pages/client/bids";
import { exportToExcel } from "../../../utils/excel";
import Table from "../../extras/table";
import { truncate } from "../projects/get-projects";

type Props = {
  acceptedBids: {
    accepted_id: number;
    accepted_date: Date;
    accepted_desc: string;
    accepted_freelance_price: number;
    accepted_by: Client | null;
    accepted_bidding:
      | (Bidding & {
          bidding_project: Project | null;
        })
      | null;
  }[];
  user: {
    Login_id: number;
    Login_username: string;
    Login_role: Role;
  } | null;
};

export default function ReportBids({ acceptedBids, user }: Props) {
  const bid = ["project name", "bid description", "accepted on", "freelancer"];
  let downloads = acceptedBids.map((bid) => {
    return {
      accepted_id: bid.accepted_id,
      accepted_date: format(new Date(`${bid?.accepted_date}`), "PPPP"),
      accepted_description: bid.accepted_desc,
      accepted_freelance_price: bid.accepted_freelance_price,
    };
  });
  let id = 0;
  return (
    <div className="flex flex-col py-2 gap-y-2">
      <div className="w-full px-2">
        <div className="w-24 ml-auto">
          <button
            onClick={() => {
              exportToExcel({
                Dbdata: downloads,
                filename: `${user?.Login_username}-${
                  user?.Login_id
                }${id++}-bids`,
                filetype:
                  "application/vnd.openxmlfromats-officedocument.spreadsheetml.sheet;cahrset=UTF-8",
                fileExtension: ".xlsx",
              });
            }}
            className="w-full px-1 py-2 text-white font-medium inline-flex items-center justify-center rounded shadow bg-teal-400 focus:ring-2 ring-teal-300 hover:ring-1 hover:bg-teal-500 focus:bg-teal-500  ring-offset-1 gap-x-2  "
          >
            <ArrowDownTrayIcon className="w-5 h-5" /> export
          </button>
        </div>
      </div>
      <div className="w-full px-2">
        <Table headers={bid}>
          {acceptedBids.map(
            (bids: {
              accepted_id: number;
              accepted_date: Date;
              accepted_desc: string;
              accepted_freelance_price: number;
              accepted_by: Client | null;
              accepted_bidding:
                | (Bidding & {
                    bidding_project: Project | null;
                  })
                | null;
            }) => {
              return (
                <tr key={bids.accepted_id} className="border-b">
                  <th
                    scope="row"
                    className="px-2 text-left py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {bids.accepted_bidding?.bidding_project?.project_name}
                  </th>
                  <td className="py-4">
                    {truncate(`${bids.accepted_desc}`, 40)}
                  </td>
                  <td className="py-4">
                    {format(new Date(`${bids?.accepted_date}`), "PPPP")}
                  </td>
                  <td className="py-4">
                    {" "}
                    {addCommas(bids.accepted_freelance_price)} ksh{" "}
                  </td>
                </tr>
              );
            }
          )}
        </Table>
      </div>
    </div>
  );
}
