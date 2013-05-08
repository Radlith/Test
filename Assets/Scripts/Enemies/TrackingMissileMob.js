#pragma strict

//Sort of bridges between mob and projectile.  It has health so it can be shot down, and explodes if it gets close enough to its target.

public class TrackingMissileMob extends BaseMob
{
	public var colliderLayerMask : LayerMask;
	
	public var target : Transform;
	//public var speed : float = 1;
	public var accel : float = 1;
	
	public var velocity : Vector3;
	public var slowdownVelocity : Vector3;
	public var exhaust : ParticleSystem;
	public var turnSpeed : float = 60;
	
	public var scanRange : float = 10;
	public var scanAngle : float = 5;
	
	public var explosionRadius : float = 5;
	public var explosionPower : float = 10;
	
	public var selfDestructDelay : float = 20;
	
	
	function Start()
	{
		super.Start();
		ScoreValue = 1;
	}
	function Update()
	{
		super.Update();
		selfDestructDelay -= Time.deltaTime;
		if(selfDestructDelay <= 0)
		{
			Detonate();
		}
	}
	
	function AIUpdate()
	{
		
	}
	
	function FixedUpdate()
	{
		if(target) 
		{
			TrackTarget();
		}
		else
		{
			if(TimeRemaining <= 0)
			{
				TimeRemaining = TimeBetweenActions;
				FindTarget();
			}
			else
			{
				Accelerate();
				TimeRemaining -= Time.fixedDeltaTime;
			}
		} 
		
		//transform.position += rigidbody.velocity * Time.deltaTime;
		transform.position += velocity * Time.deltaTime;
		//Totally not how SmoothDamp is supposed to be used.  I want it to not fail on the second try so spectacularly.
		velocity = Vector3.SmoothDamp(velocity, new Vector3(), slowdownVelocity, 2.5);

	}
	
	function TrackTarget()
	{
		//super.FixedUpdate();
		var targetDir = target.position - transform.position;
		var maxRotation : float = turnSpeed * Time.deltaTime;
		var relative : Vector3  = transform.InverseTransformPoint(target.position);
		var angle : float = Mathf.Atan2(relative.x, relative.z) * Mathf.Rad2Deg;
		var clampedAngle : float = Mathf.Clamp(angle, -maxRotation, maxRotation);
		
		if(fDebug) Debug.Log("Rotating towards: " + angle);
		if (Mathf.Abs(angle) < 5.0)
		{
			//this.rigidbody.AddRelativeForce(Vector3.forward); //I may possibly want to make this kinematic.  We'll see.
			//I did make it kinematic, and it looks like everything should be good now.
			Accelerate();
		}
		else
		{
			if(exhaust) exhaust.enableEmission = false;
		}
		
		if(Mathf.Abs(angle) > 1)
		{
	        transform.Rotate (0, clampedAngle, 0);
		}
		
	}
	
	function FindTarget()
	{
		var colliders : Collider[] = Physics.OverlapSphere(transform.position,scanRange, colliderLayerMask);
		var difference : Vector3;
		//For each target, check to see if it's more-or-less forward.
		
		
		for(var i : int = 0; i < colliders.length; i++)
		{
			difference = colliders[i].transform.position - transform.position;	
			//if(Vector3.Dot(transform.forward, ))
			//Wait.  Vector3 has an Angle function.  Probably uses the dot product internally but still.
			if(Vector3.Angle(transform.forward, difference) < scanAngle)
			{
				target = colliders[i].transform;
				//Simpler than going about it the long way :p
			}
		}		
		

	}

	function Accelerate()
	{
		velocity += transform.forward * accel * Time.deltaTime;
			if(exhaust) exhaust.enableEmission = true;
	}
	
	function OnTriggerEnter()
	{
		if(fDebug) Debug.Log("TrackingMissile OnTriggerEnter");
		//Should explode and deal damage to the target, I guess.
		//Need to make sure this works first, actually.
		
		//Ok, works now, now explody time.
		Detonate();
	}
	
	function Detonate()
	{
		var explosionPos : Vector3 = transform.position;
		//Might want to throw in the layer mask to this part too.  Maybe not.  It's only going to affect the non-kinematics, so projectiles still do their thing...
		var colliders : Collider[] = Physics.OverlapSphere (explosionPos, explosionRadius);
		var targethealth : BaseHealth;
	
		for (var hit : Collider in colliders) {
	    	if (!hit)
		        continue;
	    
	    	if (hit.rigidbody)
	    	{
	    		hit.rigidbody.AddExplosionForce(explosionPower, explosionPos, explosionRadius, 0);

				//Since addexplosionforce doesn't work the way I want, I guess I could do this instead.
				//function ClosestPointOnBounds (position : Vector3) : Vector3
				//Use that for determining damage.  I don't want to heal something because it has a huge hitbox.
				//hit.rigidbody.AddForce(explosionPower * (explosionPos - hit.transform.position).normalized * )
				
	    		targethealth = hit.gameObject.GetComponent(BaseHealth);
	    		if(targethealth)
	    		{
	    			//Linear falloff.  Good enough for now.
	    			targethealth.ReceiveDamage((explosionRadius - (explosionPos - hit.transform.position).magnitude) * explosionPower);
	    		}
	    		//hit.
	    	}
		}

	}
	
	function OnDestroy()
	{
		if(CurrentHP <= 0)
		{
			MobSpawner.instance.PointsEarned += ScoreValue;
		}
	}
}