export default function Resources() {
  const sections = [
    {
      title: "Mind Right",
      subtitle: "Mental health support — coming home is hard, get some help",
      color: "from-purple-500 to-indigo-600",
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
      ],
    },
    {
      title: "Get Your Hustle Legal",
      subtitle: "Job placement and career resources for returning citizens",
      color: "from-green-500 to-emerald-600",
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
      ],
    },
    {
      title: "Stay Out the System",
      subtitle: "Parole, reentry, and legal support so you don't go back",
      color: "from-orange-500 to-red-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      icon: "shield-alt",
      resources: [
        {
          name: "Reentry.net",
          description: "State-by-state directory of reentry resources — housing, legal aid, and parole support",
          phone: null,
          url: "https://www.reentry.net",
          tag: "All States",
        },
        {
          name: "Legal Aid Society",
          description: "Free legal help for parole violations, record expungement, and reentry legal issues",
          phone: "212-577-3300",
          url: "https://www.legalaidnyc.org",
          tag: "Free Legal Help",
        },
        {
          name: "National Reentry Resource Center",
          description: "Federal resource hub for reentry programs, parole assistance, and housing support",
          phone: null,
          url: "https://nationalreentryresourcecenter.org",
          tag: "Federal Resource",
        },
        {
          name: "Root & Rebound",
          description: "Free legal support and reentry guides — know your rights on parole and probation",
          phone: "510-279-4662",
          url: "https://www.rootandrebound.org",
          tag: "Free · Know Your Rights",
        },
      ],
    },
    {
      title: "Keep a Roof",
      subtitle: "Housing and shelter resources for when you first touch down",
      color: "from-blue-500 to-cyan-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      icon: "home",
      resources: [
        {
          name: "HUD Resource Locator",
          description: "Find federally approved housing near you — search shelters and transitional housing",
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
