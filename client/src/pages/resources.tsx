import SentenceCalculator from "../components/sentence-calculator";

export default function Resources() {
  const sections = [
    {
      title: "Mind Right",
      subtitle: "Mental health support — coming home is hard, get some help",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      icon: "brain",
      resources: [
        {
          name: "SAMHSA National Helpline",
          description: "Free, confidential, 24/7 treatment referrals for mental health and substance use",
          phone: "1-800-662-4357",
          url: "https://www.samhsa.gov/find-help/national-helpline",
          tag: "Free · 24/7",
        },
        {
          name: "Crisis Text Line",
          description: "Text HOME to 741741 — free crisis counseling anytime, anywhere",
          phone: "Text HOME to 741741",
          url: "https://www.crisistextline.org",
          tag: "Free · Text",
        },
        {
          name: "The Fortune Society",
          description: "Mental health counseling and support groups specifically for returning citizens",
          phone: "212-691-7554",
          url: "https://fortunesociety.org",
          tag: "NYC-based",
        },
        {
          name: "National Alliance on Mental Illness (NAMI)",
          description: "Free peer support programs, education, and resources for formerly incarcerated folks",
          phone: "1-800-950-6264",
          url: "https://www.nami.org",
          tag: "Nationwide",
        },
        {
          name: "988 Suicide & Crisis Lifeline",
          description: "Call or text 988 — free mental health crisis support available 24/7",
          phone: "Call or Text 988",
          url: "https://988lifeline.org",
          tag: "Free · 24/7",
        },
      ],
    },
    {
      title: "Get Your Hustle Legal",
      subtitle: "Job placement and career resources for returning citizens",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      icon: "briefcase",
      resources: [
        {
          name: "American Job Centers",
          description: "Free job training, resume help, and placement services — ban-the-box employers listed",
          phone: "1-877-872-5627",
          url: "https://www.careeronestop.org/LocalHelp/AmericanJobCenters",
          tag: "Free · Nationwide",
        },
        {
          name: "70 Million Jobs",
          description: "Job board built exclusively for people with criminal records — real employers, real opportunities",
          phone: null,
          url: "https://www.70millionjobs.com",
          tag: "Online Job Board",
        },
        {
          name: "Dave's Killer Bread Foundation",
          description: "Second Chance Employment resources and employer network committed to fair hiring",
          phone: null,
          url: "https://www.dkbfoundation.org",
          tag: "Fair Chance Hiring",
        },
        {
          name: "Honest Jobs",
          description: "Jobs specifically for people with felony records — search by location and industry",
          phone: null,
          url: "https://www.honestjobs.com",
          tag: "Online Job Board",
        },
        {
          name: "Federal Bonding Program",
          description: "Free fidelity bonds for employers who hire returning citizens — removes the biggest hiring barrier",
          phone: "1-800-233-2258",
          url: "https://bonds4jobs.com",
          tag: "Free Bonding · Nationwide",
        },
      ],
    },
    {
      title: "Stay Out the System",
      subtitle: "Parole, reentry, and legal resources so you don't go back",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      icon: "shield-alt",
      resources: [
        {
          name: "Reentry.net",
          description: "State-by-state directory of reentry programs — housing, parole support, legal aid, and more",
          phone: null,
          url: "https://www.reentry.net",
          tag: "All States",
        },
        {
          name: "Root & Rebound",
          description: "Free legal reentry guides — know your rights on parole and probation. Hotline available.",
          phone: "510-279-4662",
          url: "https://www.rootandrebound.org",
          tag: "Free · Know Your Rights",
        },
        {
          name: "National Reentry Resource Center",
          description: "Federal hub for reentry programs, parole assistance, housing, and substance use support",
          phone: null,
          url: "https://nationalreentryresourcecenter.org",
          tag: "Federal Resource",
        },
        {
          name: "Legal Aid Society",
          description: "Free legal help for parole violations, record expungement, and reentry legal issues",
          phone: "212-577-3300",
          url: "https://www.legalaidnyc.org",
          tag: "Free Legal Help",
        },
        {
          name: "Parole Compliance Help — ACLU",
          description: "Know your rights during searches, home visits, and when dealing with your PO",
          phone: null,
          url: "https://www.aclu.org/issues/prisoners-rights/parole",
          tag: "Know Your Rights",
        },
        {
          name: "Restoration of Rights Project",
          description: "State-by-state guide on restoring voting rights, gun rights, and clearing your record",
          phone: null,
          url: "https://ccresourcecenter.org/state-restoration-profiles",
          tag: "Record Clearing · All States",
        },
        {
          name: "Clean Slate Initiative",
          description: "Automatic record clearing programs — check if your state automatically expunges your record",
          phone: null,
          url: "https://www.cleanslate.org",
          tag: "Expungement · All States",
        },
        {
          name: "Prisoner Rights & Parole Violations — FAMM",
          description: "Sentencing reform advocacy, parole hearing support, and family resources for incarcerated individuals",
          phone: "202-822-6700",
          url: "https://famm.org",
          tag: "Advocacy · Nationwide",
        },
      ],
    },
    {
      title: "Keep a Roof",
      subtitle: "Housing resources for when you first touch down",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      icon: "home",
      resources: [
        {
          name: "HUD Resource Locator",
          description: "Find federally approved housing near you — shelters and transitional housing",
          phone: "1-800-569-4287",
          url: "https://resources.hud.gov",
          tag: "Federal · Nationwide",
        },
        {
          name: "Volunteers of America",
          description: "Transitional housing and reentry residential programs across the country",
          phone: "1-800-899-0089",
          url: "https://www.voa.org/returning-citizens",
          tag: "Transitional Housing",
        },
      ],
    },
  ];

  return (
    <div className="pb-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-6 text-white">
        <h2 className="text-xl font-bold">Your Lifeline</h2>
        <p className="text-gray-300 text-sm mt-1">
          Real resources to help you stay free, stay solid, and build your life out here.
        </p>
      </div>

      <div className="px-4 py-4 space-y-6">
        <SentenceCalculator />

        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${section.iconBg} flex items-center justify-center flex-shrink-0`}>
                <i className={`fas fa-${section.icon} ${section.iconColor} text-sm`}></i>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{section.title}</h3>
                <p className="text-gray-500 text-xs">{section.subtitle}</p>
              </div>
            </div>

            <div className="space-y-3">
              {section.resources.map((resource) => (
                <a
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">{resource.name}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {resource.tag}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{resource.description}</p>
                      {resource.phone && (
                        <div className="flex items-center gap-1 mt-2">
                          <i className="fas fa-phone text-gray-400 text-xs"></i>
                          <span className="text-xs text-primary font-medium">{resource.phone}</span>
                        </div>
                      )}
                    </div>
                    <i className="fas fa-external-link-alt text-gray-400 text-xs flex-shrink-0 mt-1"></i>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <i className="fas fa-hands-helping text-gray-400 text-2xl mb-2"></i>
          <p className="text-gray-600 text-sm font-medium">You made it home.</p>
          <p className="text-gray-400 text-xs mt-1">
            These resources are here to make sure you stay here. Use them — no shame in asking for help.
          </p>
        </div>
      </div>
    </div>
  );
}
