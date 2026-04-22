import { CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSanctuary } from '../context';
import { PrimaryButton, SecondaryButton, SectionEyebrow, SurfaceCard } from '../primitives';

const filters = ['All Intelligence', 'Adaptive Proposals', 'Energy Insights', 'Daily Reports', 'System'];

export function InsightsFeedPage() {
  const { tasks } = useSanctuary();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [dismissedCards, setDismissedCards] = useState<string[]>([]);
  
  const handleAction = (cardTitle: string, actionName: string) => {
    if (actionName === 'Schedule Now') {
      navigate('/focus');
    } else if (actionName === 'Reschedule') {
      navigate('/reschedule');
    } else if (actionName === 'Sync Now') {
      setDismissedCards([...dismissedCards, cardTitle]);
    }
  };

  const dismissCard = (cardTitle: string) => {
    setDismissedCards([...dismissedCards, cardTitle]);
  };

  const cards = useMemo(() => {
    const dynamicCards = [];
    const now = new Date().getTime(); // Safe to calculate inside useMemo since it only runs on tasks change
    
    const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'done');
    if (highPriorityTasks.length > 0) {
      dynamicCards.push({
        action: 'Schedule Now',
        category: 'Adaptive Proposals',
        title: 'Deep Work Optimization',
        description: `You have ${highPriorityTasks.length} high priority task(s) including "${highPriorityTasks[0].title}". I've noticed your cognitive load is lowest between 2:00 PM and 4:00 PM today. Should I reserve this window?`,
      });
    }

    const missedTasks = tasks.filter(t => t.dueAt && new Date(t.dueAt).getTime() < now && t.status !== 'done');
    if (missedTasks.length > 0) {
      dynamicCards.push({
        action: 'Reschedule',
        category: 'System',
        title: 'Schedule Drift Detected',
        description: `There are ${missedTasks.length} task(s) that missed their original deadline. Do you want me to automatically shift these into tomorrow's low-friction schedule?`,
      });
    }

    const doneTasks = tasks.filter(t => t.status === 'done');
    if (doneTasks.length >= 1) {
      dynamicCards.push({
        category: 'Energy Insights',
        title: 'Flow State Validated',
        description: `You've proven strong momentum by completing ${doneTasks.length} task(s). Advancing to complex, creative problem-solving will yield the highest return right now.`,
      });
    }

    if (dynamicCards.length === 0) {
       dynamicCards.push({
         action: 'Sync Now',
         category: 'System',
         title: 'All Systems Nominal',
         description: 'All 14 data sources and connected calendars are optimally synced to your TaskPilot Neural Core. Task load is exceptionally balanced.',
       });
       dynamicCards.push({
         category: 'Energy Insights',
         title: 'Baseline Readiness',
         description: 'Historical bio-markers over the last 30 days show consistent, strong baseline readiness at this hour.',
       });
    }
    
    return dynamicCards;
  }, [tasks]);

  return (
    <div className="space-y-4">
      <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
        <SectionEyebrow>Personalized stream</SectionEyebrow>
        <h1 className="mt-3 font-display text-5xl leading-[0.96] text-[var(--ethereal-ink)] sm:text-6xl">
          Intelligence Feed
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--ethereal-muted)]">
          Your AI agent has synthesized your day. Review these adaptive insights and system updates to
          maintain peak flow.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                filter === activeFilter
                  ? 'bg-[var(--ethereal-primary)] text-white'
                  : 'bg-[var(--ethereal-surface-soft)] text-[var(--ethereal-muted)]'
              }`}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard className="px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {cards
              .filter((card) => !dismissedCards.includes(card.title) && (activeFilter === 'All Intelligence' || card.category === activeFilter))
              .map((card, index) => (
                <div
                  key={card.title}
                  className={`rounded-[2rem] px-5 py-5 ${
                    index === 0
                      ? 'bg-white shadow-[0_12px_32px_rgba(25,28,29,0.04)]'
                      : 'bg-[var(--ethereal-surface-soft)]'
                  }`}
                >
                  <SectionEyebrow>{card.category}</SectionEyebrow>
                  <h2 className="mt-3 text-2xl font-semibold text-[var(--ethereal-ink)]">{card.title}</h2>
                  <p className="mt-3 text-base leading-8 text-[var(--ethereal-muted)]">{card.description}</p>
                  {card.action ? (
                    <div className="mt-5 flex gap-3">
                      <PrimaryButton onClick={() => handleAction(card.title, card.action!)} type="button">{card.action}</PrimaryButton>
                      <SecondaryButton onClick={() => dismissCard(card.title)} type="button">Dismiss</SecondaryButton>
                    </div>
                  ) : null}
                </div>
              ))}
          </div>

          <div className="space-y-4">
            <div className="ethereal-report-panel">
              <SectionEyebrow>Daily report</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold text-white">EOD Efficiency Summary</h2>
              <p className="mt-3 max-w-sm text-sm leading-7 text-white/78">
                You’ve regained 1.4 hours today through automated rescheduling and peak-state alignment.
                Review the full breakdown of your performance metrics.
              </p>
              <PrimaryButton className="mt-6 bg-white text-[var(--ethereal-primary)]" onClick={() => navigate('/intelligence/review')} type="button">
                View Full Report
              </PrimaryButton>
            </div>

            <SurfaceCard className="px-5 py-5">
              <SectionEyebrow>Quick actions</SectionEyebrow>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <button className="ethereal-quick-action" onClick={() => navigate('/focus')} type="button">
                  <Sparkles className="h-4 w-4 text-[var(--ethereal-primary)]" />
                  Activate Focus Mode
                </button>
                <button className="ethereal-quick-action" onClick={() => setDismissedCards(cards.map(c => c.title))} type="button">
                  <CheckCircle2 className="h-4 w-4 text-[var(--ethereal-secondary)]" />
                  Mark All as Read
                </button>
                <button className="ethereal-quick-action" onClick={() => navigate('/profile')} type="button">
                  <Zap className="h-4 w-4 text-[var(--ethereal-tertiary)]" />
                  Tune AI Sensitivity
                </button>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
