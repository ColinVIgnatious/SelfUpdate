"use client"
import { ResponsivePie } from '@nivo/pie'
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { getAllAnalyticsAdmin } from '@/api/users'
import * as d3Color from 'd3-color';
export default function Page() {
	const { data, isPending, isError } = useQuery({
		queryKey: ['analyticsadmin'],
		queryFn: () => getAllAnalyticsAdmin(),
		keepPreviousData: true,
	})
  useEffect(() => {
	  console.log(data)
	}, [data])
  return (
    <div>
      Courses In Each Category
      {data && (
		<div className="flex items-center justify-center w-[600px] h-[400px]">
    
        <ResponsivePie
          data={data?.data?.countByCategory}
          margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
          innerRadius={0.5}
          padAngle={3}
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
      )}
    </div>
  );
}



