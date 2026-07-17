import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const DEMO_DURATION_IN_FRAMES = 3150;
export const PREVIEW_DURATION_IN_FRAMES = 300;

const palette = {
  background: "#030712",
  panel: "#0f172a",
  panelRaised: "#111c32",
  border: "#2b3a55",
  text: "#f8fafc",
  muted: "#a8b5ca",
  subtle: "#71829d",
  cyan: "#67e8f9",
  cyanStrong: "#22d3ee",
  blue: "#3b82f6",
  green: "#34d399",
};

const fontFamily = '"Segoe UI", Arial, sans-serif';
const monoFamily = '"Cascadia Mono", "SFMono-Regular", Consolas, monospace';
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const screenshot = (name: string) => staticFile(`screenshots/${name}`);

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const enter = (frame: number, delay = 0, distance = 36) => {
  const progress = interpolate(frame, [delay, delay + 28], [0, 1], {
    ...clamp,
    easing: easeOut,
  });

  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  };
};

const sceneOpacity = (frame: number, duration: number) =>
  interpolate(frame, [0, 22, duration - 22, duration], [0, 1, 1, 0], clamp);

const Shell = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: palette.background,
      color: palette.text,
      fontFamily,
      overflow: "hidden",
      ...style,
    }}
  >
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 72% 24%, rgba(34, 211, 238, 0.12), transparent 34%), radial-gradient(circle at 18% 82%, rgba(59, 130, 246, 0.08), transparent 31%)",
      }}
    />
    <AbsoluteFill
      style={{
        opacity: 0.12,
        backgroundImage:
          "linear-gradient(rgba(148,163,184,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.18) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage: "linear-gradient(to bottom, black, transparent 82%)",
      }}
    />
    {children}
  </AbsoluteFill>
);

const Brand = ({ compact = false }: { compact?: boolean }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div
      style={{
        width: compact ? 44 : 58,
        height: compact ? 44 : 58,
        borderRadius: compact ? 14 : 18,
        display: "grid",
        placeItems: "center",
        color: "#082f49",
        background: palette.cyan,
        fontWeight: 900,
        fontSize: compact ? 22 : 29,
        boxShadow: "0 16px 45px rgba(34,211,238,.2)",
      }}
    >
      ↗
    </div>
    <span
      style={{
        fontSize: compact ? 28 : 38,
        fontWeight: 760,
        letterSpacing: -1.1,
      }}
    >
      CareerFlow
    </span>
  </div>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      color: palette.cyan,
      fontFamily: monoFamily,
      fontSize: 20,
      lineHeight: 1,
      letterSpacing: 3.2,
      textTransform: "uppercase",
      fontWeight: 700,
    }}
  >
    {children}
  </div>
);

const Heading = ({
  children,
  size = 76,
}: {
  children: ReactNode;
  size?: number;
}) => (
  <div
    style={{
      fontSize: size,
      lineHeight: 1.02,
      letterSpacing: -3.8,
      fontWeight: 760,
      maxWidth: 1200,
    }}
  >
    {children}
  </div>
);

const Supporting = ({
  children,
  width = 980,
}: {
  children: ReactNode;
  width?: number;
}) => (
  <div
    style={{
      color: palette.muted,
      fontSize: 30,
      lineHeight: 1.48,
      maxWidth: width,
    }}
  >
    {children}
  </div>
);

const Pill = ({
  children,
  accent = false,
}: {
  children: ReactNode;
  accent?: boolean;
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      minHeight: 48,
      padding: "0 20px",
      borderRadius: 999,
      border: `1px solid ${accent ? "rgba(103,232,249,.55)" : palette.border}`,
      background: accent ? "rgba(34,211,238,.1)" : "rgba(15,23,42,.88)",
      color: accent ? palette.cyan : palette.muted,
      fontSize: 21,
      fontWeight: 650,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

const BrowserFrame = ({
  children,
  label = "careerflow-snowy.vercel.app",
  style,
}: {
  children: ReactNode;
  label?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      border: `1px solid ${palette.border}`,
      borderRadius: 26,
      overflow: "hidden",
      background: "#020617",
      boxShadow: "0 38px 100px rgba(0,0,0,.46)",
      ...style,
    }}
  >
    <div
      style={{
        height: 62,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 22px",
        borderBottom: `1px solid ${palette.border}`,
        background: "#0a1222",
      }}
    >
      {["#64748b", "#64748b", "#64748b"].map((color, index) => (
        <span
          key={index}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: color,
            opacity: 0.76,
          }}
        />
      ))}
      <div
        style={{
          marginLeft: 14,
          padding: "9px 18px",
          borderRadius: 10,
          background: "#111c32",
          border: `1px solid ${palette.border}`,
          color: palette.subtle,
          fontFamily: monoFamily,
          fontSize: 15,
        }}
      >
        {label}
      </div>
    </div>
    {children}
  </div>
);

const ScrollingScreenshot = ({
  name,
  frame,
  from = 0,
  to = 0,
  start = 20,
  end = 180,
  width = 1500,
  windowHeight = 760,
}: {
  name: string;
  frame: number;
  from?: number;
  to?: number;
  start?: number;
  end?: number;
  width?: number;
  windowHeight?: number;
}) => {
  const translateY = interpolate(frame, [start, end], [from, to], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <BrowserFrame style={{ width }}>
      <div
        style={{
          height: windowHeight,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Img
          src={screenshot(name)}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            transform: `translateY(${translateY}px)`,
          }}
        />
      </div>
    </BrowserFrame>
  );
};

const StaticScreenshot = ({
  name,
  fit = "cover",
  position = "top",
  style,
}: {
  name: string;
  fit?: "cover" | "contain";
  position?: CSSProperties["objectPosition"];
  style?: CSSProperties;
}) => (
  <Img
    src={screenshot(name)}
    style={{
      width: "100%",
      height: "100%",
      objectFit: fit,
      objectPosition: position,
      ...style,
    }}
  />
);

const SceneLayer = ({
  from,
  duration,
  children,
}: {
  from: number;
  duration: number;
  children: ReactNode;
}) => (
  <Sequence from={from} durationInFrames={duration} premountFor={30}>
    {children}
  </Sequence>
);

const OpeningScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  const shotScale = interpolate(frame, [0, duration], [1.025, 1], clamp);
  const shotEntrance = enter(frame, 28, 55);

  return (
    <Shell>
      <AbsoluteFill style={{ opacity: sceneOpacity(frame, duration) }}>
        <div
          style={{
            position: "absolute",
            left: 130,
            top: 112,
            ...enter(frame, 4),
          }}
        >
          <Brand compact />
        </div>
        <div style={{ position: "absolute", left: 130, top: 278, zIndex: 2 }}>
          <div style={enter(frame, 12)}>
            <Eyebrow>CareerFlow v1.0</Eyebrow>
          </div>
          <div style={{ marginTop: 30, ...enter(frame, 22) }}>
            <Heading size={92}>Organize your job search with clarity.</Heading>
          </div>
          <div style={{ marginTop: 28, ...enter(frame, 32) }}>
            <Supporting width={780}>
              Applications, deadlines, progress, and resume versions—together in
              one focused workspace.
            </Supporting>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 1040,
            top: 220,
            width: 770,
            height: 640,
            opacity: shotEntrance.opacity,
            transform: `${shotEntrance.transform} scale(${shotScale}) rotate(-1.2deg)`,
            transformOrigin: "center",
          }}
        >
          <BrowserFrame>
            <div style={{ height: 578, overflow: "hidden" }}>
              <StaticScreenshot
                name="careerflow-landing-page.png"
                position="top"
              />
            </div>
          </BrowserFrame>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

const ProblemScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  const cards = [
    ["Applications", "Roles, companies, notes, and salary details"],
    ["Deadlines", "Important dates that cannot disappear into a spreadsheet"],
    ["Progress", "Statuses and outcomes spread across separate tools"],
    [
      "Resume versions",
      "Targeted versions that are difficult to connect later",
    ],
  ];

  return (
    <Shell>
      <AbsoluteFill
        style={{
          padding: "120px 132px",
          opacity: sceneOpacity(frame, duration),
        }}
      >
        <div style={enter(frame, 2)}>
          <Eyebrow>The problem</Eyebrow>
        </div>
        <div style={{ marginTop: 30, ...enter(frame, 10) }}>
          <Heading size={72}>
            A job search becomes fragmented faster than expected.
          </Heading>
        </div>
        <div style={{ marginTop: 26, ...enter(frame, 20) }}>
          <Supporting>
            Applications, deadlines, statuses, and resume versions quickly
            become difficult to manage.
          </Supporting>
        </div>
        <div
          style={{
            marginTop: 74,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
          }}
        >
          {cards.map(([title, copy], index) => (
            <div
              key={title}
              style={{
                minHeight: 295,
                borderRadius: 24,
                padding: 30,
                border: `1px solid ${palette.border}`,
                background: "rgba(15,23,42,.9)",
                ...enter(frame, 28 + index * 8, 28),
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(34,211,238,.1)",
                  border: "1px solid rgba(103,232,249,.34)",
                  color: palette.cyan,
                  fontSize: 21,
                  fontFamily: monoFamily,
                }}
              >
                0{index + 1}
              </div>
              <div style={{ marginTop: 34, fontSize: 28, fontWeight: 720 }}>
                {title}
              </div>
              <div
                style={{
                  marginTop: 16,
                  color: palette.muted,
                  fontSize: 22,
                  lineHeight: 1.5,
                }}
              >
                {copy}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

const DashboardScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();

  return (
    <Shell>
      <AbsoluteFill
        style={{
          padding: "72px 100px",
          opacity: sceneOpacity(frame, duration),
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div style={enter(frame, 0)}>
              <Eyebrow>One focused workspace</Eyebrow>
            </div>
            <div style={{ marginTop: 18, ...enter(frame, 8) }}>
              <Heading size={58}>
                See progress and what needs attention next.
              </Heading>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, ...enter(frame, 18) }}>
            <Pill>Total and status metrics</Pill>
            <Pill>Upcoming deadlines</Pill>
            <Pill accent>Interview conversion</Pill>
          </div>
        </div>
        <div
          style={{
            marginTop: 42,
            display: "flex",
            justifyContent: "center",
            ...enter(frame, 16, 42),
          }}
        >
          <ScrollingScreenshot
            name="careerflow-dashboard-desktop.png"
            frame={frame}
            from={0}
            to={-650}
            start={65}
            end={285}
            width={1680}
            windowHeight={780}
          />
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

const ApplicationsScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  const formProgress = interpolate(frame, [270, 315], [0, 1], {
    ...clamp,
    easing: easeOut,
  });

  return (
    <Shell>
      <AbsoluteFill
        style={{
          padding: "72px 100px",
          opacity: sceneOpacity(frame, duration),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={enter(frame, 0)}>
              <Eyebrow>Application management</Eyebrow>
            </div>
            <div style={{ marginTop: 18, ...enter(frame, 8) }}>
              <Heading size={60}>
                Track every opportunity from saved to offer.
              </Heading>
            </div>
          </div>
          <div style={{ ...enter(frame, 20) }}>
            <Pill accent>Validated server-side</Pill>
          </div>
        </div>
        <div style={{ marginTop: 40, position: "relative", height: 790 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              ...enter(frame, 15, 42),
            }}
          >
            <ScrollingScreenshot
              name="careerflow-applications-desktop.png"
              frame={frame}
              from={0}
              to={-280}
              start={80}
              end={255}
              width={1450}
              windowHeight={710}
            />
          </div>
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 760,
              height: 500,
              opacity: formProgress,
              transform: `translate(${(1 - formProgress) * 80}px, ${(1 - formProgress) * 40}px)`,
            }}
          >
            <BrowserFrame label="New application">
              <div style={{ height: 438, overflow: "hidden" }}>
                <StaticScreenshot
                  name="careerflow-application-form.png"
                  position="top"
                />
              </div>
            </BrowserFrame>
          </div>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

const SearchScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [10, duration - 20], [1.02, 1.1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <Shell>
      <AbsoluteFill
        style={{
          padding: "86px 110px",
          opacity: sceneOpacity(frame, duration),
        }}
      >
        <div style={enter(frame, 0)}>
          <Eyebrow>Search and filters</Eyebrow>
        </div>
        <div style={{ marginTop: 20, ...enter(frame, 8) }}>
          <Heading size={64}>
            Find the right application without losing context.
          </Heading>
        </div>
        <div
          style={{
            marginTop: 48,
            height: 650,
            overflow: "hidden",
            borderRadius: 28,
            border: `1px solid ${palette.border}`,
            boxShadow: "0 34px 90px rgba(0,0,0,.42)",
            ...enter(frame, 18, 40),
          }}
        >
          <Img
            src={screenshot("careerflow-applications-desktop.png")}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              transform: `scale(${zoom}) translateY(-16px)`,
              transformOrigin: "top center",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: 126,
            bottom: 84,
            display: "flex",
            gap: 12,
            ...enter(frame, 80, 24),
          }}
        >
          <Pill>Company or job title</Pill>
          <Pill>Status + salary + deadline</Pill>
          <Pill accent>User-scoped PostgreSQL query</Pill>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

const ResumesScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  const callouts = [
    ["Family", "Software Engineering Resume"],
    ["Version", "Frontend Focus v3"],
    ["Association", "Connected to an application"],
  ];

  return (
    <Shell>
      <AbsoluteFill
        style={{
          padding: "76px 104px",
          opacity: sceneOpacity(frame, duration),
        }}
      >
        <div style={enter(frame, 0)}>
          <Eyebrow>Resume versions</Eyebrow>
        </div>
        <div style={{ marginTop: 20, ...enter(frame, 8) }}>
          <Heading size={62}>
            Manage targeted versions and connect them to applications.
          </Heading>
        </div>
        <div
          style={{
            marginTop: 46,
            display: "grid",
            gridTemplateColumns: "1fr 390px",
            gap: 28,
          }}
        >
          <div style={{ height: 680, ...enter(frame, 18, 40) }}>
            <BrowserFrame>
              <div style={{ height: 618, overflow: "hidden" }}>
                <StaticScreenshot
                  name="careerflow-resumes-desktop.png"
                  position="top"
                />
              </div>
            </BrowserFrame>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              justifyContent: "center",
            }}
          >
            {callouts.map(([label, value], index) => (
              <div
                key={label}
                style={{
                  padding: "26px 28px",
                  borderRadius: 20,
                  background: palette.panel,
                  border: `1px solid ${palette.border}`,
                  ...enter(frame, 42 + index * 12, 28),
                }}
              >
                <div
                  style={{
                    color: palette.cyan,
                    fontFamily: monoFamily,
                    fontSize: 15,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 23,
                    lineHeight: 1.35,
                    fontWeight: 650,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

const ResponsiveScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();

  return (
    <Shell>
      <AbsoluteFill
        style={{
          padding: "72px 110px",
          opacity: sceneOpacity(frame, duration),
        }}
      >
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={enter(frame, 0)}>
            <Eyebrow>Responsive and accessible</Eyebrow>
          </div>
          <div style={{ marginTop: 20, ...enter(frame, 8) }}>
            <Heading size={62}>
              Designed to remain clear across devices and input methods.
            </Heading>
          </div>
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 70,
          }}
        >
          {[
            ["careerflow-dashboard-mobile.png", "Responsive dashboard"],
            ["careerflow-navigation-mobile.png", "Managed navigation drawer"],
          ].map(([name, label], index) => (
            <div key={name} style={{ ...enter(frame, 22 + index * 12, 44) }}>
              <div
                style={{
                  width: 328,
                  height: 710,
                  borderRadius: 42,
                  overflow: "hidden",
                  border: "10px solid #111827",
                  boxShadow: "0 32px 80px rgba(0,0,0,.5)",
                  background: "#020617",
                }}
              >
                <StaticScreenshot name={name} position="top" />
              </div>
              <div
                style={{
                  marginTop: 18,
                  textAlign: "center",
                  color: palette.muted,
                  fontSize: 20,
                }}
              >
                {label}
              </div>
            </div>
          ))}
          <div style={{ width: 650, display: "grid", gap: 18 }}>
            {[
              "Semantic landmarks and labeled controls",
              "Keyboard navigation and visible focus",
              "Accessible dialogs with focus restoration",
              "Dark and light themes",
              "Reduced-motion support in the application",
            ].map((item, index) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "20px 24px",
                  border: `1px solid ${palette.border}`,
                  borderRadius: 18,
                  background: "rgba(15,23,42,.88)",
                  fontSize: 23,
                  ...enter(frame, 42 + index * 7, 24),
                }}
              >
                <span style={{ color: palette.cyan, fontSize: 24 }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

const EngineeringScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  const tech = [
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "Auth.js",
    "179 validated tests",
    "Vercel + Neon",
  ];

  return (
    <Shell>
      <AbsoluteFill
        style={{
          padding: "108px 130px",
          opacity: sceneOpacity(frame, duration),
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "740px 1fr",
            gap: 100,
            height: "100%",
            alignItems: "center",
          }}
        >
          <div>
            <div style={enter(frame, 0)}>
              <Eyebrow>Engineering foundation</Eyebrow>
            </div>
            <div style={{ marginTop: 28, ...enter(frame, 8) }}>
              <Heading size={76}>
                A production-tested full-stack application.
              </Heading>
            </div>
            <div style={{ marginTop: 28, ...enter(frame, 18) }}>
              <Supporting width={700}>
                Server-rendered views, validated mutations, authenticated
                ownership boundaries, and a real PostgreSQL migration history.
              </Supporting>
            </div>
          </div>
          <div style={{ position: "relative", height: 720 }}>
            <div
              style={{
                position: "absolute",
                inset: 40,
                borderRadius: 38,
                border: `1px solid ${palette.border}`,
                background: "rgba(15,23,42,.86)",
                ...enter(frame, 18, 38),
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 90,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignContent: "center",
                gap: 20,
              }}
            >
              {tech.map((item, index) => (
                <div
                  key={item}
                  style={{
                    minHeight: 88,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 28px",
                    borderRadius: 18,
                    border: `1px solid ${item === "179 validated tests" ? "rgba(103,232,249,.55)" : palette.border}`,
                    background:
                      item === "179 validated tests"
                        ? "rgba(34,211,238,.1)"
                        : palette.panelRaised,
                    color:
                      item === "179 validated tests"
                        ? palette.cyan
                        : palette.text,
                    fontSize: 25,
                    fontWeight: 680,
                    ...enter(frame, 30 + index * 8, 22),
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

const ClosingScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [32, 62], [0, 1], {
    ...clamp,
    easing: easeOut,
  });

  return (
    <Shell>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          opacity: sceneOpacity(frame, duration),
        }}
      >
        <div style={enter(frame, 4)}>
          <Brand />
        </div>
        <div style={{ marginTop: 42, ...enter(frame, 14) }}>
          <Heading size={84}>CareerFlow v1.0</Heading>
        </div>
        <div
          style={{
            marginTop: 22,
            color: palette.cyan,
            fontSize: 31,
            fontWeight: 700,
            ...enter(frame, 24),
          }}
        >
          Live now
        </div>
        <div
          style={{
            width: 610 * line,
            height: 1,
            background: palette.border,
            marginTop: 38,
          }}
        />
        <div
          style={{
            marginTop: 34,
            display: "grid",
            gap: 16,
            ...enter(frame, 36),
          }}
        >
          <div
            style={{
              fontFamily: monoFamily,
              fontSize: 25,
              color: palette.text,
            }}
          >
            careerflow-snowy.vercel.app
          </div>
          <div
            style={{
              fontFamily: monoFamily,
              fontSize: 21,
              color: palette.muted,
            }}
          >
            github.com/XonkelX/ai-career-tracker
          </div>
        </div>
        <div
          style={{
            marginTop: 58,
            color: palette.subtle,
            fontSize: 19,
            ...enter(frame, 50),
          }}
        >
          Production portfolio release · Vercel Hobby + Neon Free
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

export const CareerFlowDemo = () => {
  const scenes = [
    { from: 0, duration: 180, node: <OpeningScene duration={180} /> },
    { from: 180, duration: 270, node: <ProblemScene duration={270} /> },
    { from: 450, duration: 330, node: <DashboardScene duration={330} /> },
    { from: 780, duration: 510, node: <ApplicationsScene duration={510} /> },
    { from: 1290, duration: 360, node: <SearchScene duration={360} /> },
    { from: 1650, duration: 420, node: <ResumesScene duration={420} /> },
    { from: 2070, duration: 330, node: <ResponsiveScene duration={330} /> },
    { from: 2400, duration: 480, node: <EngineeringScene duration={480} /> },
    { from: 2880, duration: 270, node: <ClosingScene duration={270} /> },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: palette.background }}>
      {scenes.map((scene) => (
        <SceneLayer
          key={scene.from}
          from={scene.from}
          duration={scene.duration}
        >
          {scene.node}
        </SceneLayer>
      ))}
    </AbsoluteFill>
  );
};

const PreviewShot = ({
  from,
  duration,
  name,
  label,
}: {
  from: number;
  duration: number;
  name: string;
  label: string;
}) => (
  <Sequence from={from} durationInFrames={duration} premountFor={20}>
    <PreviewSlide duration={duration} name={name} label={label} />
  </Sequence>
);

const PreviewSlide = ({
  duration,
  name,
  label,
}: {
  duration: number;
  name: string;
  label: string;
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1.04, 1.01], clamp);

  return (
    <Shell>
      <AbsoluteFill
        style={{
          padding: "92px 110px",
          opacity: sceneOpacity(frame, duration),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Brand compact />
          <Pill accent>{label}</Pill>
        </div>
        <div
          style={{
            marginTop: 48,
            height: 790,
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          <BrowserFrame>
            <div style={{ height: 728, overflow: "hidden" }}>
              <StaticScreenshot name={name} position="top" />
            </div>
          </BrowserFrame>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

export const CareerFlowPreview = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: palette.background }}>
      <PreviewShot
        from={0}
        duration={fps * 3}
        name="careerflow-dashboard-desktop.png"
        label="Dashboard overview"
      />
      <PreviewShot
        from={fps * 3}
        duration={fps * 3}
        name="careerflow-applications-desktop.png"
        label="Search and filters"
      />
      <PreviewShot
        from={fps * 6}
        duration={fps * 3}
        name="careerflow-resumes-desktop.png"
        label="Resume versions"
      />
      <Sequence from={fps * 9} durationInFrames={fps} premountFor={15}>
        <Shell>
          <AbsoluteFill
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Brand />
          </AbsoluteFill>
        </Shell>
      </Sequence>
    </AbsoluteFill>
  );
};
