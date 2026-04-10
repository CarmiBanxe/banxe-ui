import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Bell, Globe, FileText, LogOut, ArrowLeft, type LucideIcon } from "lucide-react"

function SettingRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: LucideIcon
  label: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-[--color-border-subtle] last:border-0">
      <div className="h-9 w-9 rounded-[--radius-md] bg-[--color-primary-subtle] flex items-center justify-center flex-shrink-0" aria-hidden="true">
        <Icon className="h-4 w-4 text-[--color-primary]" aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[--color-text-primary]">{label}</p>
        <p className="text-xs text-[--color-text-secondary] mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[--color-bg-page] px-4 py-8" aria-label="Settings">
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] mb-4"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Dashboard
          </a>
          <h1 className="text-xl font-semibold text-[--color-text-primary]">Settings</h1>
        </div>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingRow
              icon={Shield}
              label="Two-factor authentication"
              description="PSD2 SCA — required for all payments"
            >
              <span
                className="inline-flex rounded-[--radius-pill] bg-[--color-success-subtle] text-[--color-success] px-2 py-0.5 text-xs font-medium"
                aria-label="2FA enabled"
              >
                Enabled
              </span>
            </SettingRow>

            <SettingRow
              icon={Shield}
              label="Session timeout"
              description="Active sessions expire after 5 minutes of inactivity"
            >
              <span className="text-xs text-[--color-text-secondary]">5 min</span>
            </SettingRow>

            <SettingRow
              icon={Shield}
              label="Change PIN"
              description="Update your 6-digit authentication PIN"
            >
              <Button variant="outline" size="sm" aria-label="Change PIN">
                Change
              </Button>
            </SettingRow>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingRow
              icon={Bell}
              label="Payment alerts"
              description="Receive alerts for all incoming and outgoing payments"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[--color-border-default] accent-[--color-primary]"
                defaultChecked
                aria-label="Enable payment alerts"
              />
            </SettingRow>

            <SettingRow
              icon={Bell}
              label="Security alerts"
              description="Login from new devices, suspicious activity"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[--color-border-default] accent-[--color-primary]"
                defaultChecked
                aria-label="Enable security alerts"
              />
            </SettingRow>
          </CardContent>
        </Card>

        {/* GDPR */}
        <Card>
          <CardHeader>
            <CardTitle>Data &amp; Privacy (GDPR)</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingRow
              icon={Globe}
              label="Data processing consent"
              description="Manage your GDPR consent and processing preferences"
            >
              <Button variant="outline" size="sm" aria-label="Manage GDPR consent">
                Manage
              </Button>
            </SettingRow>

            <SettingRow
              icon={FileText}
              label="Download my data"
              description="Request a copy of all data BANXE holds about you (GDPR Art. 20)"
            >
              <Button variant="outline" size="sm" aria-label="Request data export">
                Request
              </Button>
            </SettingRow>

            <SettingRow
              icon={FileText}
              label="Account statement"
              description="Download your account statement (FCA PS7/24)"
            >
              <Button variant="outline" size="sm" aria-label="Download statement">
                Download
              </Button>
            </SettingRow>
          </CardContent>
        </Card>

        {/* Sign out */}
        <Button variant="outline" size="lg" className="w-full text-[--color-error] border-[--color-error] hover:bg-[--color-error-subtle]">
          <LogOut className="h-4 w-4 mr-2" aria-hidden />
          Sign out
        </Button>
      </div>
    </main>
  )
}
