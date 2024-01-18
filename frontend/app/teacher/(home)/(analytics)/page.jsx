"use client";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from '@nivo/bar';
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { getAllAnalyticsTeacher } from "@/api/users";

export default function Page() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["analyticsteacher"],
    queryFn: () => getAllAnalyticsTeacher(),
    keepPreviousData: true,
  });
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
    
      {data && (
        <div className="flex mt-10">
        <div className="flex flex-col items-center ml-20 mr-8 border rounded p-4">
        <div className="mb-4">Courses In Each Category</div>
		 <div className="flex items-center justify-center w-[400px] h-[300px]">
        <ResponsivePie
          data={data?.data?.countByCategory}
          margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
          innerRadius={0.5}
          padAngle={20}
          cornerRadius={0}
          colors={{ scheme: "greens" }}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextXOffset={6} 
          radialLabelsTextColor="#333333"
          radialLabelsLinkOffset={0}
          radialLabelsLinkDiagonalLength={16}
          radialLabelsLinkHorizontalLength={24}
          radialLabelsLinkStrokeWidth={1}
          radialLabelsLinkColor={{ from: "color" }}
          slicesLabelsSkipAngle={10}
          slicesLabelsTextColor="#333333"
          arcLinkLabelsOffset={-15}
          arcLinkLabelsStraightLength={10}
          animate
          motionStiffness={90}
          motionDamping={15}
        />
        </div>
          </div>
          <div className="flex flex-col items-center mr-8 border rounded p-4">
        <div className="mb-4">Enrollments Per Day</div>
          <div className="flex items-center justify-center w-[400px] h-[300px]">
        <ResponsiveBar
        data={data?.data?.enrollmentsPerDay}
        keys={['count']}
        indexBy="date"
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        padding={0.3}
        colors={{ scheme: 'category10' }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Date',
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Enrollments Per Day',
            legendPosition: 'middle',
            legendOffset: -40,
            truncateTickAt: 0
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        enableLabel={true}
        labelSkipWidth={12}
        labelSkipHeight={12}
           axisBottom={{
            tickRotation: -45, // Set the rotation angle for date labels
          }}
      />
        </div>
      </div>
		</div>
      )}
    </div>
  );
}
