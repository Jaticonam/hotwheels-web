import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getReadyPublicAssetUrl,
  type PublicAssetReference,
} from "./CommercialPublication";

function makeAsset(
  overrides:
    Partial<PublicAssetReference> = {},
): PublicAssetReference {
  return {
    assetId:
      "asset-001",

    kind:
      "pdf",

    status:
      "ready",

    url:
      "https://delivery.example.test/document.pdf",

    mimeType:
      "application/pdf",

    version:
      1,

    ...overrides,
  };
}

describe(
  "CommercialPublication",
  () => {
    it(
      "expone URL solo cuando el asset está ready",
      () => {
        expect(
          getReadyPublicAssetUrl(
            makeAsset(),
          ),
        ).toBe(
          "https://delivery.example.test/document.pdf",
        );
      },
    );

    it(
      "no expone URL cuando está pending",
      () => {
        expect(
          getReadyPublicAssetUrl(
            makeAsset({
              status:
                "pending",
            }),
          ),
        ).toBeNull();
      },
    );

    it(
      "no expone URL cuando está unavailable",
      () => {
        expect(
          getReadyPublicAssetUrl(
            makeAsset({
              status:
                "unavailable",
            }),
          ),
        ).toBeNull();
      },
    );

    it(
      "no expone URL vacía aunque el asset esté ready",
      () => {
        expect(
          getReadyPublicAssetUrl(
            makeAsset({
              url:
                "   ",
            }),
          ),
        ).toBeNull();
      },
    );
  },
);