export const ROLES = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    AGENT: 3,
    CUSTOMER: 4,
    CONTRACTOR: 5    
}

export const TRANSACTION_FILTER = {
    DAILY: 1,
    WEEKLY: 2,
    MONTHLY: 3,
    YEARLY: 4,
}

export const STATUS = {
    APPROVED: 'approved',
    REQUESTED: 'requested',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BLOCKED: 'blocked',
    PENDING: 'pending',
    REJECTED: 'rejected',
    COMPLETED: 'completed',
    EXPIRED: 'expired',
    DECLINED: 'declined',
    INPROGRESS: 'inprogress',
    CANCELLED: 'cancelled',
    ONLINE: 'online',
    OFFLINE: 'offline',
    TRUE: 1,
    FALSE: 0
}

export const FILE_PATHS = {
    JOB_ATTACHMENTS: 'uploads/job/attachments/',
    USER_ATTACHMENTS: 'uploads/user/attachments/'
}

export const LOG_TYPE = {
    JOB: 'job'
}

export const JOB_LOG_TYPE = {
    JOB_ADDED: 'job added',
    JOB_TIME_EXPIRED: 'job time expired',
    JOB_REQUESTED: 'job requested',
    JOB_ASSIGNED: 'job assigned',
    JOB_APPROVED: 'job approved',
    JOB_REJECTED: 'job rejected',
    JOB_DECLINED: 'job declined',
    JOB_COMPLETED: 'job completed',
    JOB_INACTIVE: 'job inactive'
}

export const NOTIFICATION_TYPES = {
    ADD_JOB: {
        key: 'new_job',
        title: 'New Request',
        description: 'You have a new Job Request'
    },
    ACCEPT_JOB: {
        key: 'job_approved',
        title: 'Job Accepted',
        description: '%s has accepted your job request'
    },
    REJECT_JOB: {
        key: 'job_cancelled',
        title: 'Job Declined',
        description: '%s has declined your job request'
    },
    CANCEL_JOB: {
        key: 'job_cancelled',
        title: 'Job Cancelled',
        description: 'You have cancelled the job'
    },
    COMPLETE_JOB: {
        key: 'job_completed',
        title: 'Job Successfully Completed',
        description: 'Thank you, Labour Square looks forward to serving you soon again.'
    },
    PACKAGE_EXPIRED: {
        key: 'package_expired',
        title: 'Package Expired',
        description: 'Your package has expired.'
    },
    ACCOUNT_APPROVED: {
        key: 'account_approved',
        title: 'Account Approved',
        description: 'Your account has been approved.'
    },
    NEW_MESSAGE: {
        key: 'new_message',
        title: 'New Message',
        description: 'You have a new message.'
    },
    GENERAL: {
        key: 'general',
        title: '',
        description: ''
    }
}