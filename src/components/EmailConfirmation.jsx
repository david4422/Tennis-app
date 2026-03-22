  import Heading from "./Heading";
  import TextLink from "./TextLink";

  function EmailConfirmation() {
    return (
      <div className="flex flex-col items-center">
        <span className="mb-4 text-4xl sm:text-5xl">✅</span>
        <Heading>Thanks for signing up!</Heading>
        <p className="mb-4 text-center opacity-60">
          We've sent a confirmation email to your inbox. Please click the link in
          the email to verify your account and complete your signup.
        </p>

        <p>
          Already confirmed?{" "}
          <TextLink to="/login" className="text-center underline">
            Sign in here
          </TextLink>
        </p>
      </div>
    );
  }

  export default EmailConfirmation;