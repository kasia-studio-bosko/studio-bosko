import { projectSchema }     from './project'
import { pressSchema }        from './press'
import { pageContentSchema }  from './pageContent'
import { projectsPageSchema } from './projectsPage'
import { impressumSchema }    from './impressum'
import { homepageSchema }     from './homepage'
import { studioPageSchema }   from './studioPage'
import { offeringPageSchema } from './offeringPage'
import { pressPageSchema }    from './pressPage'
import { inquirePageSchema }  from './inquirePage'

export const schemaTypes = [
  // Content documents
  projectSchema,
  pressSchema,
  // Dedicated page singletons (new, fully CMS-driven)
  homepageSchema,
  studioPageSchema,
  offeringPageSchema,
  pressPageSchema,
  inquirePageSchema,
  // Legacy / shared
  pageContentSchema,
  projectsPageSchema,
  impressumSchema,
]
