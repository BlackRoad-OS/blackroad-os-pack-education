// REQUIRED TRAINING FLOW – COMPLETION MUST BE AUDITABLE

/**
 * This example demonstrates a compliance-critical course that:
 * - Is marked as required training
 * - Has completion archived for audit trail
 * - Issues a certificate upon completion
 * - Has a renewal period
 * - Includes compliance category metadata
 * 
 * See course.json for the full course definition.
 */

module.exports = {
  courseId: "course:security-awareness-training",
  complianceRequirements: {
    category: "security-training",
    required: true,
    renewalPeriodMonths: 12,
    archiveRetentionYears: 7,
    certificateRequired: true,
    completionTracking: "mandatory"
  },
  flowIntegration: {
    onCompletion: "flow:education:archive-completion",
    archiveTags: {
      category: "education",
      subcategory: "required-training",
      complianceLevel: "regulated"
    }
  }
};
