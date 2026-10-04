// frontend/app/stores/ops/authGuard.ts
import { defineStore } from 'pinia'

export type OpsRole = 'super_admin' | 'warehouse_manager' | 'accountant' | 'support_agent'

export type OpsPermission =
  | 'catalog:read'
  | 'catalog:write'
  | 'orders:read'
  | 'orders:dispatch'
  | 'orders:rma'
  | 'inventory:read'
  | 'inventory:transfer'
  | 'finance:read'
  | 'finance:export'
  | 'articles:read'
  | 'articles:write'
  | 'audit:read'
  | 'sessions:manage'

export interface OpsOperator {
  id: string
  name: string
  email: string
  role: OpsRole
  avatar: string
  ip: string
  lastLogin: string
  is2FaEnabled: boolean
}

export interface OpsSession {
  id: string
  operatorId: string
  ip: string
  device: string
  browser: string
  location: string
  lastHeartbeat: string
  isCurrent: boolean
}

const ROLE_PERMISSIONS: Record<OpsRole, OpsPermission[]> = {
  super_admin: [
    'catalog:read', 'catalog:write',
    'orders:read', 'orders:dispatch', 'orders:rma',
    'inventory:read', 'inventory:transfer',
    'finance:read', 'finance:export',
    'articles:read', 'articles:write',
    'audit:read', 'sessions:manage',
  ],
  warehouse_manager: [
    'catalog:read', 'catalog:write',
    'orders:read', 'orders:dispatch',
    'inventory:read', 'inventory:transfer',
    'audit:read',
  ],
  accountant: [
    'orders:read',
    'finance:read', 'finance:export',
    'audit:read',
  ],
  support_agent: [
    'catalog:read',
    'orders:read', 'orders:rma',
    'articles:read',
  ],
}

export const useOpsRbacStore = defineStore('opsRbac', () => {
  const currentRole = ref<OpsRole>('super_admin')

  const currentOperator = ref<OpsOperator>({
    id: 'op_1405_hq',
    name: 'سارا رادمنش (مدیر ارشد آتلیه)',
    email: 'sara.rad@keras.luxury',
    role: 'super_admin',
    avatar: 'SR',
    ip: '185.190.22.41',
    lastLogin: 'امروز، ساعت ۱۱:۲۴',
    is2FaEnabled: true,
  })

  const sessions = ref<OpsSession[]>([
    {
      id: 'sess_cur_1',
      operatorId: 'op_1405_hq',
      ip: '185.190.22.41',
      device: 'MacBook Pro 16" (M3 Max)',
      browser: 'Chrome 130 (macOS)',
      location: 'تهران، نیاوران',
      lastHeartbeat: 'هم‌اکنون',
      isCurrent: true,
    },
    {
      id: 'sess_wh_2',
      operatorId: 'op_1405_hq',
      ip: '5.127.88.19',
      device: 'iPad Pro 11" (Warehouse Scanner)',
      browser: 'Safari 18.0 (iPadOS)',
      location: 'تهران، خیابان شریعتی',
      lastHeartbeat: '۱۴ دقیقه پیش',
      isCurrent: false,
    },
    {
      id: 'sess_desk_3',
      operatorId: 'op_1405_hq',
      ip: '2.144.102.77',
      device: 'Workstation Dell XPS (Windows 11)',
      browser: 'Edge 129',
      location: 'تهران، جردن',
      lastHeartbeat: '۲ ساعت پیش',
      isCurrent: false,
    },
  ])

  const permissions = computed<OpsPermission[]>(() => ROLE_PERMISSIONS[currentRole.value])

  const hasPermission = (permission: OpsPermission): boolean => {
    return permissions.value.includes(permission)
  }

  const switchRole = (role: OpsRole) => {
    currentRole.value = role
    currentOperator.value.role = role
  }

  const revokeSession = (sessionId: string) => {
    sessions.value = sessions.value.filter(s => s.id !== sessionId)
  }

  const toggle2Fa = (enabled: boolean) => {
    currentOperator.value.is2FaEnabled = enabled
  }

  return {
    currentRole,
    currentOperator,
    sessions,
    permissions,
    hasPermission,
    switchRole,
    revokeSession,
    toggle2Fa,
  }
})
