import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Accepted_bids, Bidding, Login, Project } from "@prisma/client";
import React from "react";
import { addCommas } from "../../../src/pages/client/bids";
import { exportToExcel } from "../../../utils/excel";
import { truncate } from "../../client/projects/get-projects";
import Table from "../../extras/table";

type Props = {
  user: Login | null;
  bids: (Bidding & {
    bidding_accepted_bids: (Accepted_bids & {
      accepted_bidding: {
        bidding_Freelancer: {
          freelancer_login_id: number;
        } | null;
      } | null;
    })[];
    bidding_project:
      | (Project & {
          project_bids: {
            bidding_accepted_bids: Accepted_bids[];
          }[];
        })
      | null;
  })[];
};

export default function ReportFreelancerProjects({ user, bids }: Props) {
  const downloads = bids.map((bid) => {
    return {
      project_name: bid.bidding_project?.project_name,
      project_description: bid.bidding_project?.project_desc,
      project_date: bid.bidding_project?.project_date,
      project_cost: bid.bidding_project?.project_cost,
      project_status: bid.bidding_accepted_bids?.some((acceptedBid) => {
        return (
          acceptedBid.accepted_bidding?.bidding_Freelancer
            ?.freelancer_login_id === user?.Login_id
        );
      })
        ? "accepted"
        : "pending",
    };
  });
  let id = 0;
  const projectHeaders = ["name", "description", "date", "cost", "accepted"];
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
                }${id++}-projects`,
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
        <Table headers={projectHeaders}>
          {bids.map(
            (
              bid: Bidding & {
                bidding_accepted_bids: (Accepted_bids & {
                  accepted_bidding: {
                    bidding_Freelancer: {
                      freelancer_login_id: number;
                    } | null;
                  } | null;
                })[];
                bidding_project:
                  | (Project & {
                      project_bids: {
                        bidding_accepted_bids: Accepted_bids[];
                      }[];
                    })
                  | null;
              },
              index: number
            ) => {
              return (
                <tr key={bid.bidding_id} className="border-b">
                  <th
                    scope="row"
                    className="px-2 text-left py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {bid.bidding_project?.project_name}
                  </th>
                  <td className="py-4">
                    {truncate(`${bid.bidding_project?.project_desc}`, 40)}
                  </td>
                  <td className="py-4">{bid.bidding_project?.project_date}</td>
                  <td className="py-4">
                    {" "}
                    {addCommas(bid.bidding_project?.project_cost)} ksh{" "}
                  </td>
                  <td className="py-4">
                    {bid.bidding_accepted_bids?.some((acceptedBid) => {
                      return (
                        acceptedBid.accepted_bidding?.bidding_Freelancer
                          ?.freelancer_login_id === user?.Login_id
                      );
                    }) ? (
                      <span className="border  border-green-300 bg-green-400 rounded-full py-1 px-2  text-white font-bold text-xs ">
                        {" "}
                        accepted
                      </span>
                    ) : (
                      <span className="border  border-yellow-300 bg-yellow-400 rounded-full py-1 px-2  text-white font-bold text-xs ">
                        pending
                      </span>
                    )}
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
