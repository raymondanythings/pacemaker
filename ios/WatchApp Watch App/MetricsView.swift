//
//  MetricsView.swift
//  WatchApp Watch App
//
//  Created by YongHyun Yeob on 2023/06/01.
//

import SwiftUI

struct MetricsView: View {
  @EnvironmentObject var workoutManager : WorkoutManager
    var body: some View {
      TimelineView(MetricsTimelineSchedule(from: workoutManager.builder?.startDate ?? Date())){
        context in
        VStack(alignment: .leading) {
          Text(workoutManager.heartRate.formatted(.number.precision(.fractionLength(0))) + " bpm")
          ElapsedTimeView(elapsedTime: workoutManager.builder?.elapsedTime ?? 0, showSubseconds: context.cadence == .live).foregroundColor(Color.yellow)
          Text(Measurement(value: workoutManager.distance, unit: UnitLength.meters).formatted(.measurement(width: .abbreviated, usage: .road)))
//          Text(workoutManager.distance.formatted(.number.precision(.fractionLength(0))) + " M")
          // Text(Measurement(value: workoutManager.activeEnergy,unit: UnitEnergy.kilocalories).formatted(.measurement(width: .abbreviated,usage: .workout,numberFormatStyle: .number.precision(.fractionLength(0)))))
        }
      }
      .font(.system(.title, design: .rounded).monospacedDigit().lowercaseSmallCaps())
        .frame(maxWidth: .infinity, alignment: .leading).ignoresSafeArea(edges: .bottom).scenePadding()
      
    }
}

struct MetricsView_Previews: PreviewProvider {
    static var previews: some View {
        MetricsView()
    }
}

private struct MetricsTimelineSchedule : TimelineSchedule {
  var startDate: Date

  init(from startDate: Date) {
    self.startDate = startDate
  }
  
  func entries(from startDate: Date, mode: TimelineScheduleMode) ->
  PeriodicTimelineSchedule.Entries {
    PeriodicTimelineSchedule(from:self.startDate, by: (mode == .lowFrequency ? 1.0 : 1.0 / 30.0)).entries(from: startDate, mode: mode)
  }
}
