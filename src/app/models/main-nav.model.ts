export interface IMenuItem {
  id: number;
  icon?: string;
  name: string;
  path?: string;
  children?: IMenuItem[];
  isExpanded?: boolean;
  permissions?: string[];
  animationParams?: any
}

export const MENU_ITEMS: IMenuItem[] = [
  { id: 1, name: 'navigation.dashboard', icon: 'dashboard', path: "/admin/dashboard" },
  {
    id: 2, name: 'navigation.members', icon: 'people', children: [
      {
        id: 21,
        name: 'navigation.membersData',
        path: '/admin/members',
        permissions: ['members', 'tsb_Refresh']
      },
      {
        id: 22,
        name: 'navigation.onePassService',
        path: '/admin/sessions',
        permissions: ['sessions', 'tsb_Clear']
      },
      {
        id: 23,
        name: 'navigation.memberships',
        path: '/admin/memberships',
        permissions: ['memberships', 'tsb_Refresh']
      },
      {
        id: 24,
        name: 'navigation.memAtten',
        path: '/admin/attendance',
        permissions: ['gymAttendance', 'tsb_Clear']
      },
      {
        id: 25,
        name: 'navigation.branchesVisits',
        path: '/admin/branch-visit',
        permissions: ['branchesVisits', 'Show']
      }
    ]
  },
  {
    id: 3, name: 'navigation.extra', icon: 'settings', permissions: ['extra', 'Show'], children: [
      {
        id: 31,
        name: 'navigation.potMembers',
        path: '/admin/potential-members',
        permissions: ['potMembers', 'tsb_Refresh']
      },
      {
        id: 32,
        name: 'navigation.calls',
        path: '/admin/calls',
        permissions: ['calls', 'tsb_Refresh']
      },
      {
        id: 33,
        name: 'navigation.debts',
        path: '/admin/debts',
        permissions: ['debts', 'tsb_Refresh']
      },
      {
        id: 34,
        name: 'navigation.invitations',
        path: '/admin/invitations',
        permissions: ['invitations', 'tsb_Clear']
      },
      {
        id: 35,
        name: 'navigation.receipts',
        path: '/admin/extra/receipts',
        permissions: ['receipts', 'tsb_Refresh']
      },
      {
        id: 36,
        name: 'navigation.freeBenefits',
        path: '/admin/extra/free-benefits',
        permissions: ['freeBenefits', 'tsb_Refresh']
      },
      {
        id: 339,
        name: 'navigation.benefitsReservations',
        path: '/admin/extra/benefits-reservations',
        permissions: ['benefitsReservations', 'Show']
      },
      {
        id: 37,
        name: 'navigation.approveDecline',
        path: '/admin/extra/approve-decline',
        permissions: ['approveDecline', 'tsb_Refresh']
      },
      {
        id: 38,
        name: 'navigation.complaintsAndSuggestions',
        path: '/admin/extra/complaints',
        permissions: ['complaints', 'tsb_Refresh']
      },
      {
        id: 317,
        name: 'navigation.requests',
        path: '/admin/extra/requests',
        permissions: ['requests', 'tsb_Refresh']
      },
      {
        id: 316,
        name: 'navigation.feedbacks',
        path: '/admin/extra/feedbacks',
        permissions: ['feedbacks', 'tsb_Refresh']
      },
      {
        id: 39,
        name: 'navigation.lostItems',
        path: '/admin/extra/lostItems',
        permissions: ['lostItems', 'tsb_Refresh']
      },
      {
        id: 310,
        name: 'navigation.machineMaintenance',
        path: '/admin/extra/machine-maintenance',
        permissions: ['machines', 'tsb_Refresh']
      },
      {
        id: 311,
        name: 'navigation.workouts',
        path: '/admin/extra/workouts',
        permissions: ['workouts', 'tsb_Refresh']
      },
      {
        id: 312,
        name: 'navigation.tasks',
        path: '/admin/tasks',
        permissions: ['tasks', 'tsb_Refresh']
      },
      {
        id: 313,
        name: 'navigation.freePrivateTraining',
        path: '/admin/freePrivateTraining',
        permissions: ['freePrivateTraining', 'Show']
      },
      {
        id: 314,
        name: 'navigation.membersTrainingNotes',
        path: '/admin/extra/membersTrainingNotes',
        permissions: ['membersTrainingNotes', 'tsb_Refresh']
      },
      {
        id: 315,
        name: 'navigation.reminders',
        path: '/admin/extra/reminders',
        permissions: ['reminders', 'Show']
      }
    ]
  },
  {
    id: 4, name: 'navigation.management', icon: 'build', children: [
      {
        id: 41,
        name: 'navigation.classesSched',
        path: '/admin/scheduler',
        permissions: ['classSchedule', 'tsb_Refresh'],
      },
      {
        id: 42,
        name: 'navigation.class_rooms',
        path: '/admin/management/class-rooms',
        permissions: ['classRoom', 'Show'],
      },
      {
        id: 43,
        name: 'navigation.packages',
        path: '/admin/packages',
        permissions: ['packages', 'tsb_Refresh'],
      },
      {
        id: 44,
        name: 'navigation.accounts',
        isExpanded: false,
        permissions: ['accounts', 'Show'],
        children: [
          {
            id: 4441,
            name: 'navigation.otherRevenue',
            path: '/admin/accounts/other-revenue',
            permissions: ['revenue', 'tsb_Refresh'],
          },
          {
            id: 4442,
            name: 'navigation.expenses',
            path: '/admin/accounts/expenses',
            permissions: ['expenses', 'tsb_Refresh'],
          },
          {
            id: 4443,
            name: 'navigation.deductions',
            path: '/admin/accounts/deductions',
            permissions: ['deductions', 'tsb_Refresh'],
          },
          {
            id: 4444,
            name: 'navigation.advances',
            path: '/admin/accounts/advances',
            permissions: ['advances', 'tsb_Refresh'],
          },
          {
            id: 4445,
            name: 'navigation.bonus',
            path: '/admin/accounts/bonus',
            permissions: ['bonus', 'tsb_Refresh'],
          },
          {
            id: 4446,
            name: 'navigation.salaries',
            path: '/admin/accounts/salaries',
            permissions: ['salaries', 'tsb_Refresh'],
          },
          {
            id: 4447,
            name: 'navigation.employeesCommissions',
            path: '/admin/accounts/employeesCommissions',
            permissions: ['employeesCommissions', 'tsb_Refresh'],
          }
        ],
      },
      {
        id: 45,
        name: 'navigation.announcements',
        path: '/admin/management/announcements',
        permissions: ['announcement', 'tsb_Add'],
      },
      {
        id: 46,
        name: 'navigation.salesCommission',
        isExpanded: false,
        children: [
          {
            id: 4651,
            name: 'navigation.ranges',
            path: '/admin/management/salesRanges',
            permissions: ['ranges', 'tsb_Refresh'],
          },
          {
            id: 4652,
            name: 'navigation.percentages',
            path: '/admin/management/salesPercentages',
            permissions: ['percentages', 'tsb_Refresh'],
          },
          {
            id: 4653,
            name: 'navigation.targets',
            path: '/admin/management/salesTargets',
            permissions: ['targets', 'tsb_Refresh'],
          }
        ],
      },
      {
        id: 47,
        name: 'navigation.trainerCommission',
        isExpanded: false,
        children: [
          {
            id: 4761,
            name: 'navigation.ranges',
            path: '/admin/management/coachRanges',
            permissions: ['trainersRanges', 'tsb_Refresh'],
          },
          {
            id: 4762,
            name: 'navigation.percentages',
            path: '/admin/management/coachPercentages',
            permissions: ['trainersPercentages', 'tsb_Refresh'],
          },
          {
            id: 4763,
            name: 'navigation.targets',
            path: '/admin/management/coachTargets',
            permissions: ['trainersTargets', 'tsb_Refresh'],
          }
        ],
      },
      {
        id: 48,
        name: 'navigation.instructorsClassesRates',
        path: '/admin/management/instructors-Classes-Prices',
        permissions: ['instructorsClassesPrices', 'Show'],
      },
      {
        id: 49,
        name: 'navigation.gymRules',
        path: '/admin/management/gym-rules',
        permissions: ['gymRules', 'tsb_Refresh'],
      },
      {
        id: 410,
        name: 'navigation.benefits',
        path: '/admin/management/benefits-types',
        permissions: ['benefits', 'tsb_Refresh'],
      },
      {
        id: 411,
        name: 'navigation.membersApp',
        isExpanded: false,
        children: [
          {
            id: 4111,
            name: 'navigation.gymImages',
            path: '/admin/administration/gym-images',
            permissions: ['gymImages', 'Show'],
          },
          {
            id: 4112,
            name: 'navigation.classesScheduleImages',
            path: '/admin/administration/classes-schedule-images',
            permissions: ['gymImages', 'Show'],
          },
          {
            id: 4113,
            name: 'navigation.transformationImages',
            path: '/admin/administration/trans-images',
            permissions: ['transformationImages', 'Show'],
          },
          {
            id: 4114,
            name: 'navigation.appHomeScreenSections',
            path: '/admin/management/appHomeScreenSections',
            permissions: ['news', 'tsb_Refresh'],
          },
        ]
      },
      {
        id: 418,
        name: 'navigation.memberNotifications',
        path: '/admin/management/member-notifications',
        permissions: ['memberNotification', 'tsb_Refresh'],
      },
      {
        id: 419,
        name: 'navigation.requiredFields',
        isExpanded: false,
        permissions: ['requiredFields', 'tsb_Refresh'],
        children: [
          {
            id: 41995,
            name: 'navigation.requiredFieldsMemberProfile',
            path: '/admin/management/member-profile-fields',

          },
          {
            id: 41996,
            name: 'navigation.potMembers',
            path: '/admin/management/possible-members-fields',

          }
        ],
      },
      {
        id: 420,
        name: 'navigation.machines',
        path: '/admin/management/machines',
        permissions: ['machines', 'tsb_Refresh'],
      },
      {
        id: 421,
        name: 'navigation.faqs',
        path: '/admin/management/faqs',
        permissions: ['faqs', 'tsb_Refresh'],
      },
      {
        id: 422,
        name: 'navigation.exercises',
        path: '/admin/management/exercises',
        permissions: ['exercises', 'tsb_Refresh'],
      },
      {
        id: 423,
        name: 'navigation.packagesCommissionsMonths',
        path: '/admin/management/packages-commissions',
        permissions: ['employeesCommissions', 'tsb_Refresh'],
      },
      {
        id: 424,
        name: 'navigation.notificationsTemplates',
        path: '/admin/management/notifications-Templates',
        permissions: ['notificationsTemplates', 'tsb_Refresh'],
      },
      {
        id: 425,
        name: 'navigation.closingTransactions',
        path: '/admin/management/closing-Transactions',
        permissions: ['endOfDayTransactions', 'tsb_Refresh'],
      }
    ]
  },
  {
    id: 417,
    name: 'navigation.dataList',
    icon: 'category',
    children: [
      {
        id: 41795,
        name: 'navigation.classes_genres',
        path: '/admin/management/class-genres',
        permissions: ['classesTypes', 'Show'],
      },
      {
        id: 41796,
        name: 'navigation.classes_programs',
        path: '/admin/management/class-programs',
        permissions: ['classesTypes', 'Show'],
      },
      {
        id: 41771,
        name: 'navigation.classes_types',
        path: '/admin/management/classes-types',
        permissions: ['classesTypes', 'Show'],
      },
      {
        id: 41772,
        name: 'navigation.gym_sections',
        path: '/admin/management/gym-sections',
        permissions: ['gymSections', 'Show'],
      },
      {
        id: 41773,
        name: 'navigation.expenses_types',
        path: '/admin/management/expenses-types',
        permissions: ['expensesTypes', 'tsb_Refresh'],
      },
      {
        id: 41774,
        name: 'navigation.sources_of_knowledge',
        path: '/admin/management/sources-of-knowledge',
        permissions: ['srcOfKnowledge', 'Show'],
      },
      {
        id: 41775,
        name: 'navigation.owners',
        path: '/admin/management/owners',
        permissions: ['owners', 'Show'],
      },
      {
        id: 41776,
        name: 'navigation.nationalities',
        path: '/admin/management/nationalities',
        permissions: ['nationalities', 'Show'],
      },
      {
        id: 41777,
        name: 'navigation.regions',
        path: '/admin/management/regions',
        permissions: ['regions', 'Show'],
      },
      {
        id: 41778,
        name: 'navigation.visa_types',
        path: '/admin/management/visa-types',
        permissions: ['visaTypes', 'Show'],
      },
      {
        id: 41779,
        name: 'navigation.job_titles',
        path: '/admin/management/job-titles',
        permissions: ['jobTitles', 'Show'],
      },
      {
        id: 41780,
        name: 'navigation.call_feedbacks',
        path: '/admin/management/call-feedbacks',
        permissions: ['callFeedback', 'Show'],
      },
      {
        id: 41781,
        name: 'navigation.class_cancellation_reasons',
        path: '/admin/management/class-cancellation-reasons',
        permissions: ['classCancelReasons', 'Show'],
      },
      {
        id: 41782,
        name: 'navigation.membership_cancellation_reasons',
        path: '/admin/management/membership-cancellation-reasons',
        permissions: ['membershipCancelReasons', 'Show'],
      },
      {
        id: 41783,
        name: 'navigation.interest_percentages',
        path: '/admin/management/interest-percentages',
        permissions: ['interestPercent', 'Show'],
      },
      {
        id: 41784,
        name: 'navigation.locations_inside_gym',
        path: '/admin/management/gym-locations',
        permissions: ['location', 'Show'],
      },
      {
        id: 41785,
        name: 'navigation.lost_category',
        path: '/admin/management/lost-category',
        permissions: ['lostCategory', 'Show'],
      },
      {
        id: 41786,
        name: 'navigation.machine_models',
        path: '/admin/management/machine-models',
        permissions: ['machinesModels', 'tsb_Clear'],
      },
      {
        id: 41787,
        name: 'navigation.package_type',
        path: '/admin/management/package-type',
        permissions: ['packageTypes', 'tsb_Clear'],
      },
      {
        id: 41788,
        name: 'navigation.member_level',
        path: '/admin/management/member-level',
        permissions: ['memberLevels', 'Show'],
      },
      {
        id: 41789,
        name: 'navigation.suit_size',
        path: '/admin/management/suit-size',
        permissions: ['sizes', 'tsb_Clear'],
      },
      {
        id: 41790,
        name: 'navigation.member_goals',
        path: '/admin/management/member-goals',
        permissions: ['goals', 'tsb_Clear'],
      },
      {
        id: 41791,
        name: 'navigation.sessionTypes',
        path: '/admin/management/session-types',
        permissions: ['sessionTypes', 'tsb_Add'],
      },
      {
        id: 41792,
        name: 'navigation.workout_types',
        path: '/admin/management/workout-types',
        permissions: ['workoutTypes', 'tsb_Clear'],
      },
      {
        id: 41793,
        name: 'navigation.maintenance_types',
        path: '/admin/management/maintenance-types',
        permissions: ['maintenanceTypes', 'Show'],
      },
      {
        id: 41794,
        name: 'navigation.reservation_types',
        path: '/admin/management/reservation-types',

      }
    ],
  },
  {
    id: 5, name: 'navigation.reports', icon: 'insert_drive_file', permissions: ['reports', 'Show'], children: [
      {
        id: 52,
        name: 'navigation.profit',
        path: '/admin/reports/profit',
        permissions: ['profitReport', 'Generate'],
      },
      {
        id: 545,
        name: 'navigation.profitSummary',
        path: '/admin/reports/profitSummary',
        permissions: ['profitSummaryReport', 'Generate'],
      },
      {
        id: 53,
        name: 'navigation.membershipsIncome',
        path: '/admin/reports/membershipsIncome',
        permissions: ['gymMembershipsIncome', 'Generate'],
      },
      {
        id: 54,
        name: 'navigation.personalTrainingIncome',
        path: '/admin/reports/privateMembershipsIncome',
        permissions: ['privateMembershipsIncome', 'Generate'],
      },
      {
        id: 546,
        name: 'navigation.medicalMembershipsIncome',
        path: '/admin/reports/medicalMembershipsIncome',
        permissions: ['medicalMembershipsIncome', 'Generate'],
      },
      {
        id: 55,
        name: 'navigation.memberships',
        path: '/admin/reports/memberships/all',
        permissions: ['membershipsReport', 'Generate'],
      },
      {
        id: 56,
        name: 'navigation.personalTraining',
        path: '/admin/reports/memberships/privateMemberships',
        permissions: ['privateMembershipsReport', 'Generate'],
      },
      {
        id: 57,
        name: 'navigation.notRenewedmemberships',
        path: '/admin/reports/memberships/notRenewed',
        permissions: ['notRenewMemReport', 'Generate'],
      },
      {
        id: 58,
        name: 'navigation.newRenewedmemberships',
        path: '/admin/reports/memberships/newRenewed',
        permissions: ['newRenewMemReport', 'Generate'],
      },
      {
        id: 59,
        name: 'navigation.membershipsLog',
        path: '/admin/reports/memberships/log',
        permissions: ['memLogReport', 'Generate'],
      },
      {
        id: 510,
        name: 'navigation.packagesUtil',
        path: '/admin/reports/packagesUntil',
        permissions: ['pkgUtilReport', 'Generate'],
      },
      {
        id: 511,
        name: 'navigation.daybydayprofit',
        path: '/admin/reports/daybydayprofit',
        permissions: ['dayByDayReport', 'Generate'],
      },
      {
        id: 512,
        name: 'navigation.birthdays',
        path: '/admin/reports/birthdays',
        permissions: ['birthdaysReport', 'Generate'],
      },
      {
        id: 513,
        name: 'navigation.callsSummary',
        path: '/admin/reports/callsSummary',
        permissions: ['callsReport', 'Generate'],
      },
      {
        id: 514,
        name: 'navigation.notActiveMembers',
        path: '/admin/reports/inactiveMembers',
        permissions: ['inactiveMembersReport', 'Generate'],
      },
      {
        id: 515,
        name: 'navigation.overAttendance',
        path: '/admin/reports/overAttendance',
        permissions: ['OverAttReport', 'Generate'],
      },
      {
        id: 516,
        name: 'navigation.debts',
        path: '/admin/reports/debts',
        permissions: ['debtsReport', 'Generate'],
      },
      {
        id: 517,
        name: 'navigation.salesCommission',
        path: '/admin/reports/salesCommission',
        permissions: ['salesReport', 'Generate'],
      },
      {
        id: 518,
        name: 'navigation.packageCommission',
        path: '/admin/reports/customPackagesCommission',
        permissions: ['customPackagesCommissionReport', 'Generate'],
      },
      {
        id: 519,
        name: 'navigation.logs',
        path: '/admin/reports/logs',
        permissions: ['logsReport', 'Generate'],
      },
      {
        id: 520,
        name: 'navigation.absentMembers',
        path: '/admin/reports/absent-members',
        permissions: ['absentMembersReport', 'Generate'],
      },
      {
        id: 521,
        name: 'navigation.deletedReceipts',
        path: '/admin/reports/deletedReceipts',
        permissions: ['deletedReceiptsReport', 'Generate'],
      },
      {
        id: 522,
        name: 'navigation.classes',
        children: [
          {
            id: 5221,
            name: 'navigation.classesTypes',
            path: '/admin/reports/classesTypes',
            permissions: ['classesTypesReport', 'Generate']
          },
          {
            id: 5222,
            name: 'navigation.heldClasses',
            path: '/admin/reports/heldClasses',
            permissions: ['heldClassesReport', 'Generate']
          },
          // {
          //   id: 5223,
          //   name: 'navigation.instructorDueAmount',
          //   path: '/admin/reports/instructorDueAmount',
          //   permissions: ['instructorDueAmountReport', 'Generate']
          // },
          {
            id: 5224,
            name: 'navigation.classesPerInstructorType',
            path: '/admin/reports/classesPerInstructorType',
            permissions: ['classesPerInstructorAndTypeReport', 'Generate']
          },
          {
            id: 5225,
            name: 'navigation.classesbookingList',
            path: '/admin/reports/classesBookingList',
            permissions: ['classesBookingListReport', 'Generate']
          },
          {
            id: 5226,
            name: 'navigation.cancelledClasses',
            path: '/admin/reports/cancelledClasses',
            permissions: ['cancelledClassesReport', 'Generate']
          },
          {
            id: 5227,
            name: 'navigation.membersAttendanceOnClasses',
            path: '/admin/reports/membersAttendanceOnClasses',
            permissions: ['memberReservationsReport', 'Generate']
          },
          {
            id: 5228,
            name: 'navigation.instructorsPayroll',
            path: '/admin/reports/instructors-payroll',
            permissions: ['instructorDueAmountReport', 'Generate']
          },
          {
            id: 5229,
            name: 'reports.otherEntitiesBookings',
            path: '/admin/reports/other-entities-bookings',
            permissions: ['otherEntitiesBookings', 'Generate']
          }
        ]
      },
      {
        id: 523,
        name: 'navigation.memberAttendance',
        path: '/admin/reports/memberAttendance',
        permissions: ['memberAttendanceReport', 'Generate'],
      },
      {
        id: 524,
        name: 'navigation.blockedMembers',
        path: '/admin/reports/blockedMembers',
        permissions: ['blockedMembersReport', 'Generate'],
      },
      {
        id: 525,
        name: 'navigation.members',
        path: '/admin/reports/members',
        permissions: ['membersReport', 'Generate'],
      },
      {
        id: 526,
        name: 'navigation.lostItems',
        path: '/admin/reports/lostItems',
        permissions: ['lostItemsReport', 'Generate'],
      },
      {
        id: 527,
        name: 'navigation.benefitsConsumption',
        path: '/admin/reports/benefitsConsumption',
        permissions: ['benefitsConsumptionReport', 'Generate'],
      },
      {
        id: 528,
        name: 'navigation.invitationCount',
        path: '/admin/reports/invitationCount',
        permissions: ['invitationCountReport', 'Generate'],
      },
      {
        id: 529,
        name: 'navigation.freeConsumedBenefits',
        path: '/admin/reports/freeConsumedBenefits',
        permissions: ['freeConsumedBenefitsReport', 'Generate'],
      },
      {
        id: 530,
        name: 'navigation.staffPayroll',
        path: '/admin/reports/staffPayroll',
        permissions: ['staffPayrollReport', 'Generate'],
      },
      {
        id: 531,
        name: 'navigation.membershipTransfer',
        path: '/admin/reports/membershipTransfer',
        permissions: ['membershipTransferReport', 'Generate'],
      },
      {
        id: 532,
        name: 'navigation.membershipUpgrade',
        path: '/admin/reports/membershipUpgrade',
        permissions: ['membershipUpgradeReport', 'Generate'],
      },
      {
        id: 533,
        name: 'navigation.topActiveMembers',
        path: '/admin/reports/topActiveMembers',
        permissions: ['topActiveMembersReport', 'Generate'],
      },
      {
        id: 534,
        name: 'navigation.membershipsDiscount',
        path: '/admin/reports/membershipsDiscount',
        permissions: ['membershipsDiscountReport', 'Generate'],
      },
      {
        id: 535,
        name: 'navigation.gymAttendanceCount',
        path: '/admin/reports/gymAttendanceCount',
        permissions: ['gymAttendanceCountDayByDayReport', 'Generate'],
      },
      {
        id: 536,
        name: 'navigation.maximumExpirationDate',
        path: '/admin/reports/maximumExpirationDate',
        permissions: ['maximumExpirationDateReport', 'Generate'],
      },
      {
        id: 537,
        name: 'navigation.packageUtilizationPerSalesPersonal',
        path: '/admin/reports/packageUtilizationPerSalesPersonal',
        permissions: ['packageUtilizationPerSalesPersonalReport', 'Generate'],
      },
      {
        id: 538,
        name: 'navigation.trainersReports',
        children: [
          {
            id: 5381,
            name: 'navigation.consumedPTSessions',
            path: '/admin/reports/consumedPTSessions',
            permissions: ['consumedPTSessionsReport', 'Generate']
          },
          {
            id: 5382,
            name: 'navigation.trainerClosingRatio',
            path: '/admin/reports/trainerClosingRatio',
            permissions: ['trainerClosingRatioReport', 'Generate']
          },
          {
            id: 5383,
            name: 'navigation.trainerClosingRatioDetails',
            path: '/admin/reports/trainerClosingRatioDetails',
            permissions: ['trainerClosingRatioDetailsReport', 'Generate']
          },
          {
            id: 5384,
            name: 'navigation.trainerCommission',
            path: '/admin/reports/trainerCommission',
            permissions: ['trainerReport', 'Generate']
          },
          {
            id: 5385,
            name: 'navigation.trainersAchievement',
            path: '/admin/reports/trainersAchievement',
            permissions: ['trainersAchievementReport', 'Generate']
          },
          {
            id: 5386,
            name: 'navigation.fixedTrainerCommission',
            path: '/admin/reports/fixedTrainerCommission',
            permissions: ['fixedTrainerCommissionReport', 'Generate']
          },
          {
            id: 5387,
            name: 'navigation.trainerMemberRetention',
            path: '/admin/reports/trainer-member-retention',
            permissions: ['trainerMemberRetentionReport', 'Generate']
          },
          {
            id: 5388,
            name: 'navigation.consumedPTSessionsPerMembership',
            path: '/admin/reports/consumedPTSessionsPerMembership',
            permissions: ['consumedPTSessionsPerMembershipReport', 'Generate']
          },
          {
            id: 5389,
            name: 'navigation.consumedPTSessionsPerTrainer',
            path: '/admin/reports/consumedPTSessionsPerTrainer',
            permissions: ['consumedPTSessionsPerTrainerReport', 'Generate']
          },
          {
            id: 53810,
            name: 'navigation.freePrivateTraining',
            path: '/admin/reports/freePrivateTraining',
            permissions: ['freePrivateTrainingReport', 'Generate']
          }
        ]
      },
      {
        id: 539,
        name: 'navigation.salesPersonClosingRatio',
        path: '/admin/reports/salesPersonClosingRatio',
        permissions: ['salesPersonClosingRatioReport', 'Generate'],
      },
      {
        id: 540,
        name: 'navigation.salesPersonClosingRatioDetails',
        path: '/admin/reports/salesPersonClosingRatioDetails',
        permissions: ['salesPersonClosingRatioDetailsReport', 'Generate'],
      },
      {
        id: 541,
        name: 'navigation.expenses',
        path: '/admin/reports/expenses',
        permissions: ['expenses', 'tsb_Refresh'],
      },
      {
        id: 542,
        name: 'navigation.employeeFinancial',
        path: '/admin/reports/employeeFinancial',
        permissions: ['employeeFinancialReport', 'Generate'],
      },
      {
        id: 543,
        name: 'navigation.multipleAttendancePerDay',
        path: '/admin/reports/multipleAttendancePerDay',
        permissions: ['multipleAttendancePerDayReport', 'Generate'],
      },
      {
        id: 544,
        name: 'navigation.membershipsIncomePerPackageType',
        path: '/admin/reports/membershipsIncomePerPackageType',
        permissions: ['membershipsIncomePerPackageType', 'Generate'],
      },
    ]
  },
  {
    id: 6, name: 'navigation.admin', icon: 'admin_panel_settings', permissions: ['administration', 'Show'], children: [
      {
        id: 61,
        name: 'navigation.permissions',
        path: '/admin/administration/permissions',
        permissions: ['authorities', 'tsb_Refresh']
      },
      {
        id: 62,
        name: 'navigation.roles',
        path: '/admin/administration/roles',
        permissions: ['roles', 'tsb_Refresh']
      },
      {
        id: 63,
        name: 'navigation.users',
        path: '/admin/administration/users',
        permissions: ['users', 'tsb_Refresh']
      },
      {
        id: 64,
        name: 'navigation.gymSettings',
        path: '/admin/administration/gym-settings',
        permissions: ['gymSettings', 'tsb_Clear']
      }
    ]
  },
  {
    id: 7, name: 'navigation.staff', icon: 'assignment_ind', permissions: ['staff', 'Show'], children: [
      {
        id: 71,
        name: 'navigation.staffData',
        path: '/admin/staff/staff-data',
        permissions: ['staffData', 'tsb_Refresh']
      },
      {
        id: 72,
        name: 'navigation.trainers',
        path: '/admin/staff/trainers-Data',
        permissions: ['trainersData', 'tsb_Refresh']
      },
      {
        id: 73,
        name: 'navigation.instructors',
        path: '/admin/staff/instructors',
        permissions: ['instructors', 'tsb_Refresh']
      },
      {
        id: 74,
        name: 'navigation.staffAttendance',
        path: '/admin/staff/staffAttendance',
        permissions: ['staffAttendance', 'tsb_Refresh']
      },
      {
        id: 75,
        name: 'navigation.shifts',
        path: '/admin/staff/shifts',
        permissions: ['shifts', 'tsb_Refresh']
      },
      {
        id: 76,
        name: 'navigation.employeesRequests',
        path: '/admin/staff/employees-requests',
        permissions: ['employeesRequests', 'tsb_Refresh']
      }
    ]
  },
  { id: 8, name: 'navigation.about', icon: 'help_outline', path: "/admin/public/about" },
]
