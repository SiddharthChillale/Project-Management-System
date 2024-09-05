const projects = [
    {
        name: "Project Alpha",
        description: "A groundbreaking project focused on AI-based analytics.",
        teamSize: 5,
        createdAt: "2024-01-15T10:30:00Z",
        privateAttachments: [
            {
                link: "http://example.com/private-doc1",
                folder: "docs/private"
            },
            {
                image: "http://example.com/private-image1.jpg"
            }
        ],
        publicAttachments: [
            {
                gif: "http://example.com/public-animation1.gif"
            },
            {
                video: "http://example.com/public-video1.mp4"
            }
        ]
    },
    {
        name: "Project Beta",
        description: "An innovative platform for online team collaboration.",
        teamSize: 8,
        createdAt: "2024-03-22T14:45:00Z",
        privateAttachments: [
            {
                audio: "http://example.com/private-audio1.mp3"
            },
            {
                folder: "http://example.com/private-files",
                link: "docs/private"
            }
        ],
        publicAttachments: [
            {
                link: "http://example.com/public-link",
                image: "http://example.com/public-image1.jpg"
            }
        ]
    },
    {
        name: "Project Gamma",
        description: "Research into new machine learning algorithms.",
        teamSize: 3,
        createdAt: "2024-05-10T09:00:00Z",
        privateAttachments: [
            {
                folder: "research-data",
                image: "http://example.com/private-image2.jpg"
            }
        ],
        publicAttachments: [
            {
                video: "http://example.com/public-research-video.mp4",
                audio: "http://example.com/public-podcast.mp3"
            }
        ]
    },
    {
        name: "Project Delta",
        description: "Development of a new mobile app for fitness tracking.",
        teamSize: 6,
        createdAt: "2024-06-05T16:20:00Z",
        privateAttachments: [
            {
                image: "http://example.com/private-design1.png"
            }
        ],
        publicAttachments: [
            {
                link: "http://example.com/public-tracking-app",
                gif: "http://example.com/public-animation2.gif"
            }
        ]
    },
    {
        name: "Project Epsilon",
        description: "Cloud-based data storage solution.",
        teamSize: 7,
        createdAt: "2024-08-30T11:15:00Z",
        privateAttachments: [
            {
                video: "http://example.com/private-demo.mp4"
            },
            {
                folder: "cloud-storage",
                link: "http://example.com/private-doc2"
            }
        ],
        publicAttachments: [
            {
                gif: "http://example.com/public-cloud-animation.gif",
                audio: "http://example.com/public-audio1.mp3"
            }
        ]
    }
];

const new_project = {
    name: "Project Zeta",
    description:
        "A pioneering effort to create a high-performance web framework.",
    teamSize: 4,
    createdAt: "2024-07-12T08:25:00Z",
    privateAttachments: [
        {
            link: "http://example.com/private-doc2",
            image: "http://example.com/private-screenshot1.png"
        },
        {
            audio: "http://example.com/private-audio2.mp3"
        }
    ],
    publicAttachments: [
        {
            video: "http://example.com/public-framework-presentation.mp4"
        },
        {
            gif: "http://example.com/public-feature-demo.gif"
        }
    ]
};
const update_project = {
    name: "Project Eta",
    description:
        "An ambitious project to optimize enterprise-level data analytics.",
    teamSize: 10,
    createdAt: "2024-09-18T15:40:00Z",
    privateAttachments: [
        {
            image: "http://example.com/private-analytics-diagram.png",
            folder: "http://example.com/private-analytics-data"
        },
        {
            video: "http://example.com/private-demo2.mp4"
        }
    ],
    publicAttachments: [
        {
            link: "http://example.com/public-analytics-tool"
        },
        {
            audio: "http://example.com/public-podcast2.mp3"
        }
    ]
};
const mock = {
    all: projects,
    new: new_project,
    upd: update_project
};

export default mock;
