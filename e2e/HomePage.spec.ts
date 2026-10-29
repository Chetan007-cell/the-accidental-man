import { expect, test } from "@playwright/test";

test("1.Home Page text test", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "The Accidental Man Logo THE" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "A man isn’t born. He’s built.",
      exact: true,
    }),
  ).toBeVisible();
  // await page.getByRole('heading', { name: 'Fresh from the journal' }).click();
  await expect(page.getByText("01BecomeStarting where you")).toBeVisible();
  await expect(page.getByText("02MaintainThe daily")).toBeVisible();
  await expect(page.getByText("03EvolveExpanding your")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "The Nine Pillars of Becoming" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Essays In The JournalMindLearning, attention, habits, judgment, confidence, and",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Essay In The JournalEmotionsEmotional literacy, resilience, self-respect,",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Essay In The JournalBodyMovement, strength, sleep, nutrition, health, and",
    ),
  ).toBeVisible();
  // await page.getByText('Essay In The JournalSpirit & PurposeValues, meaning, identity, reflection, and').click();

  await expect(
    page.getByText(
      "05Expanding SoonGroomingSimple, inclusive routines, practical self-care, and",
    ),
  ).toBeVisible();
  // await page.getByText('06Expanding SoonStyleFit,').click();
  await expect(page.getByText("06Expanding SoonStyleFit")).toBeVisible();
  await expect(page.getByText("07Expanding SoonCareer &")).toBeVisible();
  await expect(
    page.getByText(
      "08Expanding SoonRelationshipsFriendship, family, partnership, communication,",
    ),
  ).toBeVisible();
  await expect(page.getByText("09Expanding SoonLifeHome,")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Journal", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Pillars", exact: true }),
  ).toBeVisible();
  // await page.getByRole('link', { name: 'Philosophy' }).click();
  await expect(page.getByRole("link", { name: "Philosophy" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Letters" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Fresh from the journal" }),
  ).toBeVisible();
});

// test('2.Home Page button test', async ({ page }) => {

// });
