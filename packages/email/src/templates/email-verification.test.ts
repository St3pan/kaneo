import { render } from "react-email";
import { createElement } from "react";
import { describe, expect, it } from "vite-plus/test";
import EmailVerificationEmail from "./email-verification";

describe("EmailVerificationEmail", () => {
  it("asks the person to confirm their address", async () => {
    const html = await render(
      createElement(EmailVerificationEmail, {
        verificationLink: "https://kaneo.example/api/auth/verify-email?token=x",
        locale: "ja-JP",
      }),
    );
    expect(html).toContain("メールアドレスの確認");
    expect(html).toContain("verify-email?token=x");
  });

  it("asks for confirmation in Ukrainian", async () => {
    const html = await render(
      createElement(EmailVerificationEmail, {
        verificationLink: "https://kaneo.example/api/auth/verify-email?token=x",
        locale: "uk-UA",
        email: "olena@example.com",
        requestedBy: "sign-up",
      }),
    );
    expect(html).toContain("Підтвердьте адресу електронної пошти");
    expect(html).toContain("бо хтось створив обліковий запис");
  });
});
