"use client";

import * as React from "react";
import {
  Section,
  Panel,
  SubsectionLabel,
  Row,
  Stack,
  Grid,
} from "@/app/_components/demo-helpers";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Image, CoverImage } from "@/components/ui/image";
import { QRCode } from "@/components/ui/qrcode";
import { Watermark } from "@/components/ui/watermark";
import { useT } from "@/components/language-provider";

/**
 * Inline SVG data URI — keeps the Image demo self-contained so it renders
 * identically offline and never depends on a remote host.
 *
 * The bitmap is deliberately transparent: `Image` paints a gray plate
 * (`bg-muted`) behind it, so the demo reads as a plain gray block that follows
 * the active light/dark theme instead of a hard-coded colour.
 */
const SAMPLE_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'/%3E";

export function MediaSection() {
  const t = useT();

  const slides = [
    { title: t("media.slide1"), desc: t("media.slide1Desc") },
    { title: t("media.slide2"), desc: t("media.slide2Desc") },
    { title: t("media.slide3"), desc: t("media.slide3Desc") },
  ];

  return (
    <Section
      id="media"
      title={t("media.title")}
      description={t("media.description")}
    >
      <Stack className="gap-4">
        <Panel>
          <SubsectionLabel>{t("media.carousel")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("media.carouselHint")}
          </p>
          <Carousel className="w-full">
            <CarouselContent>
              {slides.map((slide, i) => (
                <CarouselItem key={i}>
                  {/* `px-14` used to reserve room for the arrows, which were
                      overlaid on the slide. They now sit outside the track. */}
                  <div className="flex h-32 flex-col justify-center rounded-lg border border-border bg-hover-bg px-6 text-center">
                    <p className="text-sm font-medium">{slide.title}</p>
                    <p className="mt-1 text-xs text-foreground-muted">
                      {slide.desc}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("media.image")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("media.imageHint")}
          </p>
          <Grid cols={3} className="items-start">
            <div>
              <Image
                src={SAMPLE_IMAGE}
                alt="Orkest sample"
                width={160}
                height={120}
                rounded="lg"
              />
              <p className="mt-2 text-xs text-foreground-subtle">rounded=lg</p>
            </div>
            <div>
              <CoverImage
                src={SAMPLE_IMAGE}
                alt="Orkest cover"
                ratio={16 / 9}
                rounded="lg"
              />
              <p className="mt-2 text-xs text-foreground-subtle">
                {t("media.imageRatio")}
              </p>
            </div>
            <div>
              <Image
                alt="Missing source"
                width={160}
                height={120}
                rounded="lg"
              />
              <p className="mt-2 text-xs text-foreground-subtle">
                {t("media.imageFallback")}
              </p>
            </div>
          </Grid>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("media.qrcode")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("media.qrcodeHint")}
          </p>
          <Row className="items-start gap-6">
            <div className="rounded-lg border border-border p-4">
              <QRCode value="https://google.com" size={128} />
            </div>
            <div className="rounded-lg border border-border p-4">
              <QRCode value="https://google.com" size={96} level="H" />
            </div>
          </Row>
        </Panel>

        <Panel>
          <SubsectionLabel>{t("media.watermark")}</SubsectionLabel>
          <p className="text-xs text-foreground-subtle mb-3">
            {t("media.watermarkHint")}
          </p>
          <Watermark
            content={t("media.watermarkContent")}
            className="rounded-lg border border-border bg-surface"
          >
            {/* The tiled unit is a square of `gap` px (200 by default) with the
                text centered inside it, so rows repeat every 200px. A box under
                ~305px tall only ever shows the first row. */}
            <div className="relative z-10 flex min-h-[360px] flex-col justify-center p-6">
              <p className="text-sm font-medium">{t("media.watermarkCard")}</p>
              <p className="mt-1 text-xs text-foreground-muted">
                {t("media.watermarkCardBody")}
              </p>
            </div>
          </Watermark>
        </Panel>
      </Stack>
    </Section>
  );
}
